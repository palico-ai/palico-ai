import { ChatCompletionOutput } from './app';

export interface OpenAILLMParams {
  model?: string;
  apiKey?: string;
}

interface CallLLMCommonParams {
  userPrompt: string;
  tools?: Record<string, unknown>;
}

interface SendUserMessageParams extends CallLLMCommonParams {
  systemPrompt?: string;
  userPrompt: string;
}

type ReplyToConversationParams = CallLLMCommonParams & {
  conversationId: string;
}

export class OpenAILLMClient {
  constructor() {
    console.log('OpenAILLM created');
  }

  async newMessage(
    params: SendUserMessageParams
  ): Promise<ChatCompletionOutput> {
    throw new Error('Method not implemented.');
  }

  async replyToConversation(
    params: ReplyToConversationParams
  ): Promise<ChatCompletionOutput> {
    throw new Error('Method not implemented.');
  }

  async sendToolExecutionResult(
    toolOutputs: Record<string, unknown>
  ): Promise<ChatCompletionOutput> {
    throw new Error('Method not implemented.');
  }
}
