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

export type JSONAbleObject<
  KV extends Record<string, any> = Record<string, any>
> = KV;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppConfig<KV extends Record<string, any> = Record<string, any>> =
  KV;

export interface ConversationContext<AC extends AppConfig = AppConfig> {
  conversationId: string;
  requestId: string;
  isNewConversation: boolean;
  appConfig: AppConfig<AC>;
}

export * from './studio';
export * from './experiment';
export * from './api';
export * from './telemetry';
