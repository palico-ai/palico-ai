import { createAPIClient } from '@palico-ai/client-js';

export interface PalicoClientParams {
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

export const createPalicoClient = (params: PalicoClientParams) => {
  const { fetch } = createAPIClient({
    rootURL: params.apiURL,
    serviceKey: params.serviceKey,
  });

  const chat = async (params: ChatRequestParams) => {
    const url = params.conversationId
      ? `/agent/${params.agentName}/conversation/${params.conversationId}/reply`
      : `/agent/${params.agentName}/conversation`;
    return await fetch(url, {
      method: 'POST',
      body: {
        content: {
          userMessage: params.userMessage,
          payload: params.payload,
        },
        appConfig: params.appConfig,
        stream: true,
      },
    });
  };

  return {
    chat,
  };
};
