// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AgentResponseMetadata = Record<string, any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AgentResponse<Data = Record<string, any>> {
  conversationId: string;
  requestId: string;
  message?: string;
  data?: Data;
  metadata?: AgentResponseMetadata; // @deprecated - use AgentRawResponse instead
}

export interface AgentStreamResponseDelta {
  message?: string;
  data?: any;
  done?: boolean;
}

export interface AgentStreamResponse {
  conversationId: string;
  requestId: string;
  delta: AgentStreamResponseDelta;
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
