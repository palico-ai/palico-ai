import { AgentResponse, JSONAbleObject } from '@palico-ai/common';

export type ChatResponseMetadata = JSONAbleObject;

export interface ChatJSONResponse<D = JSONAbleObject, M = ChatResponseMetadata>
  extends Pick<AgentResponse<D>, 'message' | 'data'> {
  metadata?: M;
}

export type ChatHandlerResponse = ChatJSONResponse | ReadableStream;
