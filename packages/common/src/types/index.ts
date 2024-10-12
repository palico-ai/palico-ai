import { JSONAbleObject } from './common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ConversationResponseMetadata = Record<string, any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ConversationResponse<Data = Record<string, any>> {
  conversationId: string;
  requestId: string;
  message?: string; // for chat-based requests
  data?: Data; // for chat-based requests
  metadata?: ConversationResponseMetadata;
}

export interface WorkflowResponse<
  Output extends JSONAbleObject = JSONAbleObject
> {
  conversationId: string;
  requestId: string;
  output: Output;
  data?: JSONAbleObject; // for conversational workflows, data can be stored here
  message?: string; // for conversational workflows, message can be stored here
  metadata?: JSONAbleObject;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ChatRequestContent<Payload = Record<string, any>> {
  userMessage?: string;
  payload?: Payload;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppConfig<KV extends Record<string, any> = Record<string, any>> =
  KV;

export interface ConversationContext<AC extends AppConfig = AppConfig> {
  conversationId: string;
  requestId: string;
  isNewConversation: boolean;
  appConfig: AppConfig<AC>;
}

export * from './common';
export * from './studio';
export * from './experiment';
export * from './api';
export * from './telemetry';
export * from './workflow';
