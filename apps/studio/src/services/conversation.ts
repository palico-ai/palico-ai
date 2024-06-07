'use server';

import {
  ClientNewConversationParams,
  ClientReplyToConversationParams,
} from '@palico-ai/client-js';
import {
  ConversationalEntity,
  ConversationalEntityType,
} from '../types/common';
import { getPalicoClient } from './palico';

export const newConversation = async (
  entity: ConversationalEntity,
  payload: Omit<ClientNewConversationParams, 'name'>
) => {
  const client = await getPalicoClient();
  if (entity.type === ConversationalEntityType.AGENT) {
    return await client.agents.newConversation({
      name: entity.name,
      ...payload,
    });
  }
  return await client.workflows.newConversation({
    name: entity.name,
    ...payload,
  });
};

export const replyToConversation = async (
  entity: ConversationalEntity,
  payload: Omit<ClientReplyToConversationParams, 'name'>
) => {
  const client = await getPalicoClient();
  if (entity.type === ConversationalEntityType.AGENT) {
    return await client.agents.replyAsUser({
      name: entity.name,
      ...payload,
    });
  }
  return await client.workflows.replyAsUser({
    name: entity.name,
    ...payload,
  });
};
