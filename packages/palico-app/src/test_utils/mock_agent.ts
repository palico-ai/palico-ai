import {
  AgentRequestContent,
  AgentRequestContext,
  AgentResponse,
} from '@palico-ai/common';

export const mockAgentResponse = (
  response: Partial<AgentResponse> = {}
): AgentResponse => {
  return {
    conversationId: 'mock-conversation-id',
    requestId: 'mock-request-id',
    message: 'mock message',
    data: {},
    ...response,
  };
};

export const mockAgentRequestContext = (
  context: Partial<AgentRequestContext> = {}
): AgentRequestContext => {
  return {
    conversationId: 'mock-conversation-id',
    requestId: 'mock-request-id',
    isNewConversation: context.isNewConversation ?? true,
    appConfig: {},
    ...context,
  };
};

export const mockAgentRequestContent = (
  content: Partial<AgentRequestContent> = {}
): AgentRequestContent => {
  return {
    userMessage: 'mock user message',
    payload: {},
    ...content,
  };
};
