import {
  type ClientReplyAsUserFN,
  type ClientNewConversationFN,
  type IPalicoClient,
  type ClientReplyToToolCallFN,
} from './types';
import { createAgentAPIFetcher } from './request';

interface ClientConfig {
  apiURL: string;
  serviceKey: string;
}

export const createClient = (config: ClientConfig): IPalicoClient => {
  const { apiURL, serviceKey } = config;
  const apiFetch = createAgentAPIFetcher({ rootURL: apiURL, serviceKey });

  const newConversation: ClientNewConversationFN = async (params) => {
    return await apiFetch(`/agent/${params.agentId}/conversation`, {
      method: 'POST',
      body: JSON.stringify({
        content: {
          userMessage: params.userMessage,
          payload: params.payload,
        },
        featureFlags: params.featureFlags,
      }),
    });
  };

  const replyAsUser: ClientReplyAsUserFN = async (params) => {
    return await apiFetch(
      `/agent/${params.agentId}/conversation/${params.conversationId}/reply`,
      {
        method: 'POST',
        body: JSON.stringify({
          content: {
            userMessage: params.userMessage,
            payload: params.payload,
          },
          featureFlags: params.featureFlags,
        }),
      }
    );
  };

  // @deprecated
  const replyToToolCall: ClientReplyToToolCallFN = async (params) => {
    const payload = {
      toolOutputs: params.toolOutputs,
    };
    const response = await fetch(
      `${apiURL}/agent/${params.conversationId}/reply-as-tool`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${serviceKey}`,
        },
        body: JSON.stringify(payload),
      }
    );
    const data = await response.json();
    if (response.status !== 200) {
      console.error(data);
      throw new Error(JSON.stringify(data, null, 2));
    }
    return data;
  };

  return {
    agents: {
      newConversation,
      replyAsUser,
      replyToToolCall,
    },
  };
};
