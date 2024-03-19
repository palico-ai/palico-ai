import {
  type ReplyAsUserParams,
  type NewConversationParams,
  type ReplyToToolCallParams,
  type AgentCallResponse,
} from "./types";
import { createClient } from "./create_client";

export enum AgentRequestType {
  NewConversation = "new-conversation",
  ReplyAsUser = "reply-as-user",
  ReplyAsTool = "reply-as-tool",
}

export interface NewConversationRequest {
  type: AgentRequestType.NewConversation;
  payload: NewConversationParams;
}

export interface ReplyAsUserRequest {
  type: AgentRequestType.ReplyAsUser;
  payload: ReplyAsUserParams;
}

export interface ReplyAsToolRequest {
  type: AgentRequestType.ReplyAsTool;
  payload: ReplyToToolCallParams;
}

export type AgentRequest =
  | NewConversationRequest
  | ReplyAsUserRequest
  | ReplyAsToolRequest;

export type AgentRequestHandler = (
  request: AgentRequest
) => Promise<AgentCallResponse>;

export interface ProxyRequestHandlerParams {
  headers?: Record<string, string>;
}

/**
 * This function creates a request handler that sends the request to a proxy route
 * You can use this to send requests to your own server, which then forwards the request to the agent API
 * This is useful if you want to add custom logic such as auth checks, rate limiting, etc.
 * @param proxyRoute 
 * @param params 
 * @returns 
 */
export const createProxyRequestHandler = (
  proxyRoute: string,
  params?: ProxyRequestHandlerParams
): AgentRequestHandler => {
  return async (request: AgentRequest): Promise<AgentCallResponse> => {
    const response = await fetch(proxyRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...params?.headers,
      },
      body: JSON.stringify(request),
    });
    const data = await response.json();
    if (response.status !== 200) {
      console.error(data);
      throw new Error("Failed to handle agent request.");
    }
    return data;
  };
};

export const createRequestHandler = (
  agentAPIURL: string,
  serviceKey: string
): AgentRequestHandler => {
  // Should generally be done on server side
  return async (request: AgentRequest): Promise<AgentCallResponse> => {
    const client = createClient({ apiURL: agentAPIURL, serviceKey });
    switch (request.type) {
      case AgentRequestType.NewConversation:
        return await client.newConversation(request.payload);
      case AgentRequestType.ReplyAsUser:
        return await client.replyAsUser(request.payload);
      case AgentRequestType.ReplyAsTool:
        return await client.replyToToolCall(request.payload);
    }
  };
};
