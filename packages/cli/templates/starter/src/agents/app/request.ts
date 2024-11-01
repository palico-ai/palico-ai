import {
  ChatHandlerResponse,
  ChatRequestHandler,
  getTracer,
  messageRecord,
} from "@palico-ai/app";
import OpenAI from "openai";

const tracer = getTracer("ChatbotAgent");

type OpenAIMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

const handler: ChatRequestHandler = async ({
  conversationId,
  isNewConversation,
  userMessage,
  appConfig,
}): Promise<ChatHandlerResponse> => {
  return await tracer.trace("ChatbotAgent->chat", async (span) => {
    // adding tracing for better observability
    span.setAttributes({
      message: userMessage,
      model: appConfig.model,
    });
    // building our prompt and message history for OpenAI
    if (!userMessage) throw new Error("User message is required");
    const messageHistory = await createOpenAIMessageHistory(
      conversationId,
      userMessage,
      isNewConversation
    );
    // call OpenAI API and get the stream response
    const openAIResponse = await callGPTModel(
      appConfig.model ?? "gpt-3.5-turbo-0125",
      messageHistory
    );
    const responseMessage = openAIResponse.choices[0].message.content;
    // save message history for future requests in the same conversation
    messageHistory.push({ role: "assistant", content: responseMessage });
    if (isNewConversation) {
      await messageRecord().create<OpenAIMessage>(
        conversationId,
        messageHistory
      );
    } else {
      await messageRecord().update<OpenAIMessage>(
        conversationId,
        messageHistory
      );
    }
    return {
      message: openAIResponse.choices[0].message.content ?? "",
    };
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
        role: "system",
        content: "Your response must be in markdown format",
      },
      {
        role: "user",
        content: userMessage,
      }
    );
  } else {
    const previousMessages = await messageRecord().get<OpenAIMessage>(
      conversationId
    );
    messageHistory.push(...previousMessages, {
      role: "user",
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
    throw new Error("OPENAI_API_KEY is not set");
  }
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const response = await client.chat.completions.create({
    model: model,
    temperature: 0,
    messages: messages,
  });
  return response;
};

export default handler;
