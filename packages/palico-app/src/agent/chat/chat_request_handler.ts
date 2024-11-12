import {
  AgentRequestContent,
  AgentRequestContext,
  AgentResponse,
  JSONAbleObject,
} from '@palico-ai/common';
import { ChatResponseStream } from './stream';

/**
 * Additional metadata that you want to log with the response.
 * Often used for tagging metrics data
 */
export type ChatResponseMetadata = JSONAbleObject;

/**
 * Response sent back to the client after processing a chat request.
 */
export interface ChatResponse<D = JSONAbleObject, M = ChatResponseMetadata>
  extends Pick<
    AgentResponse<D>,
    'message' | 'data' | 'toolCalls' | 'intermediateSteps'
  > {
  metadata?: M;
}

export type ChatHandlerResponse<
  D = JSONAbleObject,
  M = JSONAbleObject
> = ChatResponse<D, M> | void;

export interface ChatRequest<P = JSONAbleObject, AC = JSONAbleObject>
  extends AgentRequestContent<P>,
    AgentRequestContext<AC> {
  /**
   * Stream helper class used to send back chunks of data to the client.
   */
  stream: ChatResponseStream;
}

export type Chat<
  InputPayload = JSONAbleObject,
  AppConfig = JSONAbleObject,
  OutputData = JSONAbleObject,
  OutputMetadata = JSONAbleObject
> = (
  params: ChatRequest<InputPayload, AppConfig>
) => Promise<ChatHandlerResponse<OutputData, OutputMetadata>>;
