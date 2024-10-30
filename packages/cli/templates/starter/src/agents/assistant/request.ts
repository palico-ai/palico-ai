import { Chat, Logger } from '@palico-ai/app';
import { OpenAIService } from '../../utils/openai';

interface InputData {}

interface AppConfig {
  model: string;
}

export default class RequestHandler extends Chat<InputData, AppConfig> {
  async handler() {
    if (!this.userMessage) throw new Error('User message is required');

    if (this.isNewConversation) {
      // handle new conversation
      const response = await OpenAIService.newConversation({
        conversationId: this.conversationId,
        message: this.userMessage,
        model: this.getModelName(),
      });
      // log the response
      Logger.log('New conversation', response);
      return response;
    } else {
      // handle existing conversation
      const response = await OpenAIService.replyToConversation({
        conversationId: this.conversationId,
        message: this.userMessage,
        model: this.getModelName(),
      });
      // log the response
      Logger.log('Existing conversation', this.conversationId, response);
      return response;
    }
  }

  private getModelName(): string {
    switch (this.appConfig.model) {
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
