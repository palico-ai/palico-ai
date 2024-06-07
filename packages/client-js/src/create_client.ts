import {
  type ReplyAsUserFN,
  type NewConversationFN,
  type IPalicoClient,
  type AgentReplyToToolCallFN,
  PalicoAgentClient,
  PalicoWorkflowClient,
} from './types';
import { createAgentAPIFetcher } from './request';

interface ClientConfig {
  apiURL: string;
  serviceKey: string;
}

const createAgentClient = (config: ClientConfig): PalicoAgentClient => {
  const { apiURL, serviceKey } = config;
  const apiFetch = createAgentAPIFetcher({ rootURL: apiURL, serviceKey });

  const newConversation: NewConversationFN = async (params) => {
    return await apiFetch(`/agent/${params.name}/conversation`, {
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

  const replyAsUser: ReplyAsUserFN = async (params) => {
    return await apiFetch(
      `/agent/${params.name}/conversation/${params.conversationId}/reply`,
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
  const replyToToolCall: AgentReplyToToolCallFN = async (params) => {
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
    newConversation,
    replyAsUser,
    replyToToolCall,
  };
};

const createWorkflowClient = (config: ClientConfig): PalicoWorkflowClient => {
  const { apiURL, serviceKey } = config;
  const apiFetch = createAgentAPIFetcher({ rootURL: apiURL, serviceKey });

  const newConversation: NewConversationFN = async (params) => {
    return await apiFetch(`/workflow/${params.name}/conversation`, {
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

  const replyAsUser: ReplyAsUserFN = async (params) => {
    return await apiFetch(
      `/workflow/${params.name}/conversation/${params.conversationId}/reply`,
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

  return {
    newConversation,
    replyAsUser,
  };
};

export const createClient = (config: ClientConfig): IPalicoClient => {
  return {
    agents: createAgentClient(config),
    workflows: createWorkflowClient(config),
  };
};
