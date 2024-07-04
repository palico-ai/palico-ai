// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ConversationResponseMetadata = Record<string, any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ConversationResponse<Data = Record<string, any>> {
  conversationId: string;
  requestId: string;
  message?: string;
  data?: Data;
  metadata?: ConversationResponseMetadata;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ConversationRequestContent<Payload = Record<string, any>> {
  userMessage?: string;
  payload?: Payload;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppConfig = Record<string, any>;

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
