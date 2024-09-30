import {
  ConversationContext,
  ConversationRequestContent,
  Agent,
  AgentResponse,
  getTracer,
  Logger,
} from '@palico-ai/app';
import { OpenAIService } from '../../utils/openai';

export interface AppConfig {
  model?: 'gpt35' | 'gpt35-turbo' | 'gpt4' | 'gpt4o';
}

const tracer = getTracer('ChatbotAgent');

class ChatbotAgent implements Agent {
  static readonly NAME: string = __dirname.split('/').pop()!;

  async chat(
    content: ConversationRequestContent,
    context: ConversationContext<AppConfig>
  ): Promise<AgentResponse> {
    return await tracer.trace('ChatbotAgent->chat', async (span) => {
      // get the request input
      const { userMessage } = content;
      if (!userMessage) throw new Error('User message is required');

      // get the request context
      const {
        isNewConversation,
        conversationId,
        appConfig: { model },
      } = context;

      // add request details in traces for better debugging
      span.setAttributes({
        message: userMessage,
        model,
      });

      if (isNewConversation) {
        // handle new conversation
        const response = await OpenAIService.newConversation({
          conversationId,
          message: userMessage,
          model: ChatbotAgent.getModelName(model),
        });
        // log the response
        Logger.log('New conversation', response);
        return response;
      } else {
        // handle existing conversation
        const response = await OpenAIService.replyToConversation({
          conversationId,
          message: userMessage,
          model: ChatbotAgent.getModelName(model),
        });
        // log the response
        Logger.log('Existing conversation', conversationId, response);
        return response;
      }
    });
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
