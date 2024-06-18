export interface ConversationResponse<Data = Record<string, unknown>> {
  conversationId: string;
  requestId: string;
  message?: string;
  data?: Data;
}

export interface ConversationRequestContent<Payload = Record<string, unknown>> {
  userMessage?: string;
  payload?: Payload;
}

export interface ConversationContext {
  conversationId: string;
  requestId: string;
  isNewConversation: boolean;
  otel: {
    traceId: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  featureFlags: Record<string, any>;
}

export * from './studio';
export * from './experiment';
export * from './api';
export * from './telemetry';
