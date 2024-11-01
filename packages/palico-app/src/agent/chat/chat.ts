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

/**
 * Request Handler for a Chat Message
 *
 * @template P - Expected input payload from request
 * @template AC - App Config / Feature Flag values expected
 */
export abstract class Chat<P = JSONAbleObject, AC = JSONAbleObject> {
  /**
   * The ID of the conversation.
   */
  conversationId: string;

  /**
   * The ID of the request.
   */
  requestId: string;

  /**
   * Indicates if this is a new conversation.
   */
  isNewConversation: boolean;

  /**
   * The message from the user, if any.
   */
  userMessage?: string;

  /**
   * The payload of the chat, if any.
   */
  payload?: P;

  /**
   * App Config / Feature Flag values.
   */
  appConfig: AC;

  constructor(params: NewChatRequestParams<P, AC>) {
    this.conversationId = params.conversationId;
    this.requestId = params.requestId;
    this.isNewConversation = params.isNewConversation;
    this.userMessage = params.content.userMessage;
    this.payload = params.content.payload;
    this.appConfig = params.appConfig;
  }

  /**
   * Handle a chat request.
   * This function is ran when a chat request is received.
   *
   * @param stream - The chat response stream.
   * @returns Either a ChatResponse JSON, or void if it's a stream
   */
  abstract handler(stream: ChatResponseStream): Promise<ChatHandlerResponse>;
}
