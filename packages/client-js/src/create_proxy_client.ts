import { IPalicoClient } from './types';

export interface CreateProxyClientParams {
  apiURL: string;
  headers?: Record<string, string>;
}

export const createProxyClient = (
  config: CreateProxyClientParams
): IPalicoClient => {
  const proxyRequest = async (request: ProxyRequest) => {
    const response = await fetch(`${config.apiURL}`, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      body: JSON.stringify(request),
    });
    const data = await response.json();
    if (response.status !== 200) {
      console.error(data);
      throw new Error(JSON.stringify(data, null, 2));
    }
    return data;
  };

  return {
    agents: {
      newConversation: async (params) => {
        return await proxyRequest({
          action: ProxyAction.NewConversation,
          params,
        });
      },
      replyAsUser: async (params) => {
        return await proxyRequest({
          action: ProxyAction.ReplyAsUser,
          params,
        });
      },
      replyToToolCall: async () => {
        throw new Error('Not yet implemented');
      },
    },
    metadata: {
      getAgentsMetadata: async () => {
        return await proxyRequest({
          action: ProxyAction.GetAgenstMetadata,
        });
      },
    },
  };
};

enum ProxyAction {
  NewConversation = 'newConversation',
  ReplyAsUser = 'replyAsUser',
  GetAgenstMetadata = 'getAgentMetadata',
}

export interface ProxyRequest {
  action: ProxyAction;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any;
}

export const handleProxyRequest = async (
  request: ProxyRequest,
  client: IPalicoClient
) => {
  switch (request.action) {
    case ProxyAction.NewConversation:
      return await client.agents.newConversation(request.params);
    case ProxyAction.ReplyAsUser:
      return await client.agents.replyAsUser(request.params);
    case ProxyAction.GetAgenstMetadata:
      return await client.metadata.getAgentsMetadata();
    default:
      throw new Error(`Unknown action: ${request.action}`);
  }
};
