import { TimedEvent } from '@opentelemetry/sdk-trace-node';
import { AppConfig, AgentRequestContent, AgentResponse } from '.';

export interface AgentRequestTrace {
  requestId: string;
  conversationId: string;
  requestInput: AgentRequestContent;
  responseOutput: AgentResponse;
  appConfig: AppConfig;
  traceId?: string;
  tracePreviewUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RequestSpan {
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

export interface AgentConversationTraceWithRequest {
  conversationId: string;
  agentName?: string;
  workflowName?: string; // @ deprecated
  requests: AgentRequestTrace[];
  createdAt: string;
  updatedAt: string;
}

export type ConversationTracesWithoutRequests = Omit<
  AgentConversationTraceWithRequest,
  'requests'
>;
