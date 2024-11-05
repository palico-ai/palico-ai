import {
  AgentResponse,
  AgentResponseStreamReader,
  JSONAbleObject,
  ToolCallResult,
} from '@palico-ai/common';

export interface CreateClientParams {
  apiURL: string;
  serviceKey: string;
}

export interface ChatRequestParams {
  agentName: string;
  conversationId?: string;
  userMessage?: string;
  payload?: JSONAbleObject;
  appConfig?: JSONAbleObject;
  toolCallResults?: ToolCallResult[];
}

export interface ChatRequestParamsWithStream extends ChatRequestParams {
  stream: true;
}

export type ChatFN = {
  (params: ChatRequestParams): Promise<AgentResponse>;
  (params: ChatRequestParamsWithStream): Promise<AgentResponseStreamReader>;
};
