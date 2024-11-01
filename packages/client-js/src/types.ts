import {
  AppConfig,
  AgentRequestContent,
  AgentResponse,
  AgentResponseChunk,
} from '@palico-ai/common';

export interface NewConversationParams extends AgentRequestContent {
  agentName: string;
  appConfig?: AppConfig;
}

export interface NewConversationWithStreamParams extends NewConversationParams {
  stream?: boolean;
}

// TODO: Add support for streaming response in client-js
export type NewConversationFN = {
  (params: NewConversationParams): Promise<AgentResponse>;
  (
    params: NewConversationWithStreamParams
  ): AsyncIterableIterator<AgentResponseChunk>;
};

export interface ReplyToConversationParams extends AgentRequestContent {
  name: string;
  conversationId: string;
  appConfig?: AppConfig;
}

export interface IAgent {
  newConversation: (params: NewConversationParams) => Promise<AgentResponse>;
  reply: (params: ReplyToConversationParams) => Promise<AgentResponse>;
}

export interface IAPI {
  get: <R = any>(path: string) => Promise<R>;
  post: <R = any, B = any>(path: string, body: B) => Promise<R>;
}

export interface CreateClientParams {
  apiURL: string;
  serviceKey: string;
}

export interface IPalicoClient {
  agent: IAgent;
  api: IAPI;
}
