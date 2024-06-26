import { AppConfig, ConversationRequestContent, ConversationResponse } from '.';

export interface ConversationRequestTraceItem {
  requestId: string;
  conversationId: string;
  requestInput: ConversationRequestContent;
  responseOutput: ConversationResponse;
  appConfig: AppConfig;
  traceId: string;
  tracePreviewUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationTraces {
  conversationId: string;
  agentName?: string;
  workflowName?: string;
  requests: ConversationRequestTraceItem[];
  createdAt: string;
  updatedAt: string;
}

export type ConversationTracesWithoutRequests = Omit<
  ConversationTraces,
  'requests'
>;
