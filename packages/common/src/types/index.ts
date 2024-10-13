// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AgentResponseMetadata = Record<string, any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AgentResponse<Data = Record<string, any>> {
  conversationId: string;
  requestId: string;
  message?: string;
  data?: Data;
  metadata?: AgentResponseMetadata;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AgentRequestContent<Payload = Record<string, any>> {
  userMessage?: string;
  payload?: Payload;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppConfig<KV extends Record<string, any> = Record<string, any>> =
  KV;

export interface AgentRequestContext<AC extends AppConfig = AppConfig> {
  conversationId: string;
  requestId: string;
  isNewConversation: boolean;
  otel: {
    traceId: string;
  };
  appConfig: AppConfig<AC>;
}

export * from './studio';
export * from './experiment';
export * from './api';
export * from './telemetry';
export * from './common';
export * from './app_script';
