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

export const createNextJSAPIAgentRequestHandler = (
  route: string
): AgentRequestHandler => {
  return async (request: AgentRequest): Promise<AgentCallResponse> => {
    const response = await fetch(route, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

export const createProxyAPIAgentRequestHandler = (
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
