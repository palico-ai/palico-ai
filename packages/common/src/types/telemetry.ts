import { TimedEvent } from '@opentelemetry/sdk-trace-node';
import { AppConfig, JSONAbleObject } from '.';

export interface ConversationRequestItem<
  Input = JSONAbleObject,
  Output = JSONAbleObject
> {
  requestId: string;
  conversationId: string;
  requestInput: Input;
  responseOutput: Output;
  appConfig: AppConfig;
  updatedAt: string;
  createdAt: string;
  tracePreviewUrl?: string; // @deprecated
  traceId?: string; // @deprecated
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

export enum LogType {
  Log = 'LOG',
  INFO = 'INFO',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
}

export interface LogItem {
  type: LogType;
  message: string;
  timestamp: number;
  callerName?: string;
}

export interface RequestLogs {
  requestId: string;
  logs: LogItem[];
}

export interface ConversationTraceWithRequests {
  conversationId: string;
  agentName?: string;
  workflowName?: string;
  requests: ConversationRequestItem[];
  createdAt: string;
  updatedAt: string;
}

export type ConversationTraceWithoutRequests = Omit<
  ConversationTraceWithRequests,
  'requests'
>;
