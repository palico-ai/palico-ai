'use server';

import {
  GetRecentConversationResponse,
  GetTelemetryForRequestIdResponse,
  GetConversationTelemetryResponse,
  PaginationParams,
  GetRecentRequestTelemetryResponse,
  ConversationRequestTelemetryItem,
  GetRequestSpanResponse,
} from '@palico-ai/common';
import { verifySession } from './auth';
import { palicoFetch } from './palico';
import { PaginatedResponse } from '../types/common';
import { paginatedResponse } from '../utils/requests';

export const getRecentConversations = async (pagination: PaginationParams) => {
  await verifySession();
  const response = await palicoFetch<GetRecentConversationResponse>(
    `/telemetry/conversation?limit=${pagination.limit}&offset=${pagination.offset}`,
    {
      method: 'GET',
    }
  );
  return response.conversations;
};

export const getConversationTelemetry = async (conversationId: string) => {
  await verifySession();
  const response = await palicoFetch<GetConversationTelemetryResponse>(
    `/telemetry/conversation/${conversationId}`,
    {
      method: 'GET',
    }
  );
  return response.conversation;
};

export const getRecentRequests = async (
  pagination: PaginationParams
): Promise<PaginatedResponse<ConversationRequestTelemetryItem>> => {
  await verifySession();
  const response = await palicoFetch<GetRecentRequestTelemetryResponse>(
    `/telemetry/request?limit=${pagination.limit}&offset=${pagination.offset}`,
    {
      method: 'GET',
    }
  );
  return paginatedResponse(response.requests, pagination);
};

export const getRequestTelemetry = async (requestId: string) => {
  await verifySession();
  const response = await palicoFetch<GetTelemetryForRequestIdResponse>(
    `/telemetry/request/${requestId}`,
    {
      method: 'GET',
    }
  );
  return response.request;
};

export const getRequestSpans = async (requestId: string) => {
  await verifySession();
  const response = await palicoFetch<GetRequestSpanResponse>(
    `/telemetry/request/${requestId}/spans`,
    {
      method: 'GET',
    }
  );
  return response.spans;
};
