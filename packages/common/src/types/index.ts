export interface ConversationResponse<Data = Record<string, unknown>> {
  message?: string;
  data?: Data;
}

export interface AgentResponse<Data = Record<string, unknown>>
  extends ConversationResponse<Data> {
  conversationId: string;
}

export interface ConversationRequestContent<Payload = Record<string, unknown>> {
  userMessage?: string;
  payload?: Payload;
}

export interface ConversationContext {
  requestId: string;
  otel: {
    traceId: string;
  };
  featureFlags: Record<string, unknown>;
}

export * from './studio';
export * from './experiment';
export * from './api';