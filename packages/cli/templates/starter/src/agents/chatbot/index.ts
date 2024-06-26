import {
  ConversationContext,
  ConversationRequestContent,
  Agent,
  AgentResponse,
} from '@palico-ai/app';
import { OpenAIService } from '../../utils/openai';

export interface AppConfig {
  model?: 'gpt35' | 'gpt35-turbo' | 'gpt4' | 'gpt4o';
}

class ChatbotAgent implements Agent {
  static readonly NAME: string = __dirname.split('/').pop()!;

  async chat(
    content: ConversationRequestContent,
    context: ConversationContext
  ): Promise<AgentResponse> {
    const { userMessage } = content;
    if (!userMessage) throw new Error('User message is required');
    const { conversationId, appConfig, isNewConversation } = context;
    const { model } = appConfig as AppConfig;
    if (isNewConversation) {
      const response = await OpenAIService.newConversation({
        conversationId,
        message: userMessage,
        model: ChatbotAgent.getModelName(model),
      });
      return response;
    } else {
      const response = await OpenAIService.replyToConversation({
        conversationId,
        message: userMessage,
        model: ChatbotAgent.getModelName(model),
      });
      return response;
    }
  }

  private static getModelName(model?: string): string {
    switch (model) {
      case 'gpt35':
        return 'gpt-3.5-turbo-0125';
      case 'gpt35-turbo':
        return 'gpt-3.5-turbo-0125';
      case 'gpt4':
        return 'gpt-4-turbo';
      case 'gpt4o':
        return 'gpt-4o';
      default:
        return 'gpt-3.5-turbo-0125';
    }
  }
}

export default ChatbotAgent;
