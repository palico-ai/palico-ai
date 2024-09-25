import { TimedEvent } from '@opentelemetry/sdk-trace-node';
import { AppConfig, ConversationRequestContent, ConversationResponse } from '.';

export interface ConversationRequestTelemetryItem {
  requestId: string;
  conversationId: string;
  requestInput: ConversationRequestContent;
  responseOutput: ConversationResponse;
  appConfig: AppConfig;
  traceId?: string;
  tracePreviewUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationRequestSpan {
  spanId: string;
  requestId: string;
  conversationId: string;
  parentSpanId: string | undefined;
  name: string;
  attributes: Record<string, unknown>;
  events: TimedEvent[];
  timestamp: number;
  duration: number;
  statusCode: number;
}

export interface ConversationTelemetry {
  conversationId: string;
  agentName?: string;
  workflowName?: string;
  requests: ConversationRequestTelemetryItem[];
  createdAt: string;
  updatedAt: string;
}

export type ConversationTracesWithoutRequests = Omit<
  ConversationTelemetry,
  'requests'
>;
