import {
  AgentConversationAPIRequestBody,
  AgentConversationAPIRequestResponse,
} from '@palico-ai/common';
import { createAPIClient } from './request';
import { CreateClientParams, IAgent, NewConversationFN } from './types';

export const agent = (config: CreateClientParams): IAgent => {
  const { apiURL, serviceKey } = config;
  const { fetchJSON } = createAPIClient({ rootURL: apiURL, serviceKey });

  return {
    newConversation: async (params) => {
      return await fetchJSON<
        AgentConversationAPIRequestResponse,
        AgentConversationAPIRequestBody
      >(`/agent/${params.agentName}/conversation`, {
        method: 'POST',
        body: {
          content: {
            userMessage: params.userMessage,
            payload: params.payload,
          },
          appConfig: params.appConfig,
        },
      });
    },
    reply: async (params) => {
      return await fetchJSON<
        AgentConversationAPIRequestResponse,
        AgentConversationAPIRequestBody
      >(`/agent/${params.name}/conversation/${params.conversationId}/reply`, {
        method: 'POST',
        body: {
          content: {
            userMessage: params.userMessage,
            payload: params.payload,
          },
          appConfig: params.appConfig,
        },
      });
    },
  };
};
