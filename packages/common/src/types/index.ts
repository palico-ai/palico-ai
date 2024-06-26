// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ConversationResponse<Data = Record<string, any>> {
  conversationId: string;
  requestId: string;
  message?: string;
  data?: Data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ConversationRequestContent<Payload = Record<string, any>> {
  userMessage?: string;
  payload?: Payload;
}

export type AppConfig = Record<string, unknown>;

export interface ConversationContext {
  conversationId: string;
  requestId: string;
  isNewConversation: boolean;
  otel: {
    traceId: string;
  };
  appConfig: AppConfig;
}

export * from './studio';
export * from './experiment';
export * from './api';
export * from './telemetry';
