import { AppConfig, JSONAbleObject } from '@palico-ai/common';
import { ChatHandlerResponse } from './chat_response';

export interface ChatRequestContent<P = JSONAbleObject> {
  userMessage?: string;
  payload?: P;
}

export interface NewChatRequestParams<P = JSONAbleObject, AC = AppConfig> {
  conversationId: string;
  requestId: string;
  isNewConversation: boolean;
  content: ChatRequestContent<P>;
  appConfig: AC;
}

export abstract class Chat<P = JSONAbleObject, AC = JSONAbleObject> {
  conversationId: string;
  requestId: string;
  isNewConversation: boolean;
  userMessage?: string;
  payload?: P;
  appConfig: AC;

  constructor(params: NewChatRequestParams<P, AC>) {
    this.conversationId = params.conversationId;
    this.requestId = params.requestId;
    this.isNewConversation = params.isNewConversation;
    this.userMessage = params.content.userMessage;
    this.payload = params.content.payload;
    this.appConfig = params.appConfig;
  }

  abstract handler(): Promise<ChatHandlerResponse>;
}
