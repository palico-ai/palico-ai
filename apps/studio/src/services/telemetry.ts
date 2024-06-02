'use server';

import { GetRecentConversationResponse, GetTraceForRequestIdResponse, GetTracesByConversationResponse, PaginationParams } from '@palico-ai/common';
import { verifySession } from './auth';
import { palicoFetch } from './palico';

export const getTracesForConversation = async (
  conversationId: string
) => {
  await verifySession();
  const response = await palicoFetch<GetTracesByConversationResponse>(`/telemetry/traces/conversation/${conversationId}`, {
    method: 'GET',
  });
  return response.conversation;
};

export const getRecentTraces = async (pagination: PaginationParams) => {
  await verifySession();
  return await palicoFetch(
    `/telemetry/traces?limit=${pagination.limit}&offset=${pagination.offset}`,
    {
      method: 'GET',
    }
  );
};

export const getRecentConversations = async (pagination: PaginationParams) => {
  await verifySession();
  const response = await palicoFetch<GetRecentConversationResponse>(
    `/telemetry/traces/conversation?limit=${pagination.limit}&offset=${pagination.offset}`,
    {
      method: 'GET',
    }
  );
  return response.conversations;
}


export const getTraceForRequestId = async (requestId: string) => {
  await verifySession();
  const response = await palicoFetch<GetTraceForRequestIdResponse>(`/telemetry/traces/request/${requestId}`, {
    method: 'GET',
  });
  return response.request;
}