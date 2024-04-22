import {
  ChatCompletionMessageInput,
  ChatCompletionOutput,
  ILLMAgent,
  ReplyToConversationParams,
} from './app';
import { OpenAILLMClient } from './llm';

export class TestOpenAILLM implements ILLMAgent {
  openaiClient: OpenAILLMClient;

  constructor() {
    // super();
    console.log('TestOpenAILLM created');
    this.openaiClient = new OpenAILLMClient();
  }

  // We want developers to be able to define their prompt, and call the LLM, thus this doesn't really help
  async newConversation(
    params: ChatCompletionMessageInput
  ): Promise<ChatCompletionOutput> {
    const systemPrompt = 'You are a helpful chatbot';
    const userPrompt = params.userMessage;
    const response = await this.openaiClient.newMessage({
      systemPrompt,
      userPrompt,
    });
    return response;
  }

  async replyToConversation(
    conversationId: string,
    params: ReplyToConversationParams
  ): Promise<ChatCompletionOutput> {
    const {
      userMessage,
    } = params;
    if(!userMessage) {
      throw new Error('User message is required. Tool execution is not supported.');
    }
    const response = await this.openaiClient.replyToConversation({
      conversationId,
      userPrompt: userMessage,
    });
    return response;
  }
}
