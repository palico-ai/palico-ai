'use server';

import {
  NewConversationParams,
  ReplyToConversationParams,
} from '@palico-ai/client-js';
import { palicoSDK } from './palico';
import {
  AgentConversationAPIRequestBody,
  AgentConversationAPIRequestResponse,
} from '@palico-ai/common';

export const newConversation = async (params: NewConversationParams) => {
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

export const replyToConversation = async (
  params: ReplyToConversationParams
) => {
  const client = await palicoSDK();
  return await client.agent.reply(params);
};
