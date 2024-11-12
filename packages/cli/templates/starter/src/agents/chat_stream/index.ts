import {
  Chat,
  ChatResponseStream,
  createConversationState,
  getConversationState,
  getTracer,
  logger,
  updateConversationState,
} from '@palico-ai/app';
import OpenAI from 'openai';
import { Stream } from 'openai/streaming';

const tracer = getTracer('StreamingChatbotAgent');

type OpenAIMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

export interface ConversationState {
  messages: OpenAIMessage[];
}

const handler: Chat = async ({
  conversationId,
  isNewConversation,
  userMessage,
  appConfig,
  stream,
}) => {
  return await tracer.trace('ChatbotAgent->chat', async (span) => {
    // adding traces for better observability and debugging
    span.setAttributes({
      message: userMessage,
      model: appConfig.model,
    });

    logger.log('Creating message history for LLM Model');
    if (!userMessage) throw new Error('User message is required');
    const messageHistory = await createOpenAIMessageHistory(
      conversationId,
      userMessage,
      isNewConversation
    );

    logger.log('Calling OpenAI');
    const openAIResponse = await callGPTModel(
      appConfig.model ?? 'gpt-3.5-turbo-0125',
      messageHistory
    );

    logger.log("Streaming OpenAI's response back to client");
    const { completeMessage } = await streamResponseToClient(
      openAIResponse,
      stream
    );

    logger.log('Saving message history for future requests');
    messageHistory.push({ role: 'assistant', content: completeMessage });
    if (isNewConversation) {
      await createConversationState<ConversationState>(conversationId, {
        messages: messageHistory,
      });
    } else {
      await updateConversationState<ConversationState>(conversationId, {
        messages: messageHistory,
      });
    }
  });
};

const createOpenAIMessageHistory = async (
  conversationId: string,
  userMessage: string,
  isNewConversation: boolean
) => {
  const messageHistory: OpenAIMessage[] = [];
  if (isNewConversation) {
    messageHistory.push(
      {
        role: 'system',
        content: 'Your response must be in markdown format',
      },
      {
        role: 'user',
        content: userMessage,
      }
    );
  } else {
    const { messages: previousMessages } =
      await getConversationState<ConversationState>(conversationId);
    messageHistory.push(...previousMessages, {
      role: 'user',
      content: userMessage,
    });
  }
  return messageHistory;
};

const callGPTModel = async (
  model: string,
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const response = await client.chat.completions.create({
    stream: true,
    model: model,
    temperature: 0,
    messages: messages,
  });
  return response;
};

const streamResponseToClient = async (
  openAIResponse: Stream<OpenAI.Chat.Completions.ChatCompletionChunk>,
  stream: ChatResponseStream
) => {
  let completeMessage = '';
  for await (const chunk of openAIResponse) {
    logger.log('Chunk:', chunk.choices[0].delta);
    if (chunk.choices[0].delta.content) {
      completeMessage += chunk.choices[0].delta.content;
      stream.push({
        message: chunk.choices[0].delta.content,
      });
    }
  }
  return { completeMessage };
};

export default handler;
