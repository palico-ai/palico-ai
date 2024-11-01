'use server';

import {} from '@palico-ai/client-js';
import { palicoSDK } from './palico';
import {
  AgentConversationAPIRequestBody,
  AgentConversationAPIRequestResponse,
} from '@palico-ai/common';
import { ChatRequestParams } from '@palico-ai/client-js';

export const newConversation = async (params: ChatRequestParams) => {
  const client = await palicoSDK();
  const response = await client.api.post<
    AgentConversationAPIRequestResponse,
    AgentConversationAPIRequestBody
  >(`/agent/${params.agentName}/conversation`, {
    content: {
      userMessage: params.userMessage,
      payload: params.payload,
    },
    appConfig: params.appConfig,
    stream: false,
  });
  return response;
};
