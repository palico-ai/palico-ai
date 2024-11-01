import { AgentResponse, JSONAbleObject } from '@palico-ai/common';
import { ChatResponseStream } from './stream';

export type ChatResponseMetadata = JSONAbleObject;

export interface ChatResponse<D = JSONAbleObject, M = ChatResponseMetadata>
  extends Pick<AgentResponse<D>, 'message' | 'data'> {
  metadata?: M;
}

export type ChatHandlerResponse<
  D = JSONAbleObject,
  M = JSONAbleObject
> = ChatResponse<D, M> | void;

export interface ChatRequest<P = JSONAbleObject, AC = JSONAbleObject> {
  conversationId: string;
  requestId: string;
  isNewConversation: boolean;
  userMessage?: string;
  payload?: P;
  appConfig: AC;
  stream: ChatResponseStream;
}

export type ChatRequestHandler<
  InputPayload = JSONAbleObject,
  AppConfig = JSONAbleObject,
  OutputData = JSONAbleObject,
  OutputMetadata = JSONAbleObject
> = (
  params: ChatRequest<InputPayload, AppConfig>
) => Promise<ChatHandlerResponse<OutputData, OutputMetadata>>;
