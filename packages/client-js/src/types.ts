import { AgentResponse, AgentResponseStreamReader } from '@palico-ai/common';

export interface CreateClientParams {
  apiURL: string;
  serviceKey: string;
}

export interface ChatRequestParams {
  agentName: string;
  conversationId?: string;
  userMessage?: string;
  payload?: Record<string, unknown>;
  appConfig?: Record<string, unknown>;
}

export interface ChatRequestParamsWithStream extends ChatRequestParams {
  stream: true;
}

export type ChatFN = {
  (params: ChatRequestParams): Promise<AgentResponse>;
  (params: ChatRequestParamsWithStream): Promise<AgentResponseStreamReader>;
};
