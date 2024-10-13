'use server';

import {
  GetRecentConversationResponse,
  GetTelemetryForRequestIdResponse,
  GetConversationTelemetryResponse,
  PaginationParams,
  GetRecentRequestTelemetryResponse,
  AgentRequestTrace,
  GetRequestSpanResponse,
  GetRequestLogsResponse,
} from '@palico-ai/common';
import { palicoFetch } from './palico';
import { PaginatedResponse } from '../types/common';
import { paginatedResponse } from '../utils/requests';

export const getRecentConversations = async (pagination: PaginationParams) => {
  const response = await palicoFetch<GetRecentConversationResponse>(
    `/telemetry/conversation?limit=${pagination.limit}&offset=${pagination.offset}`,
    {
      method: 'GET',
    }
  );
  return response.conversations;
};

export const getConversationTelemetry = async (conversationId: string) => {
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
): Promise<PaginatedResponse<AgentRequestTrace>> => {
  const response = await palicoFetch<GetRecentRequestTelemetryResponse>(
    `/telemetry/request?limit=${pagination.limit}&offset=${pagination.offset}`,
    {
      method: 'GET',
    }
  );
  return paginatedResponse(response.requests, pagination);
};

export const getRequestTelemetry = async (requestId: string) => {
  const response = await palicoFetch<GetTelemetryForRequestIdResponse>(
    `/telemetry/request/${requestId}`,
    {
      method: 'GET',
    }
  );
  return response.request;
};

export const getRequestSpans = async (requestId: string) => {
  const response = await palicoFetch<GetRequestSpanResponse>(
    `/telemetry/request/${requestId}/spans`,
    {
      method: 'GET',
    }
  );
  return response.spans;
};

export const getRequestLogs = async (requestId: string) => {
  const response = await palicoFetch<GetRequestLogsResponse>(
    `/telemetry/request/${requestId}/logs`,
    {
      method: 'GET',
    }
  );
  return response.logs;
};
