import { AgentResponse, AppConfig, JSONAbleObject } from '@palico-ai/common';
import { ChatResponseStream } from './stream';

export type ChatResponseMetadata = JSONAbleObject;

export interface ChatResponse<D = JSONAbleObject, M = ChatResponseMetadata>
  extends Pick<AgentResponse<D>, 'message' | 'data'> {
  metadata?: M;
}

export type ChatHandlerResponse = ChatResponse | void;

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

  abstract handler(stream: ChatResponseStream): Promise<ChatHandlerResponse>;
}
