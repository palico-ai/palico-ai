import { RequestHandler } from 'express';
import { ConversationTelemetryModel } from '../../../services/database/conversation_telemetry';
import { APIError } from '../../error';
import {
  GetConversationTelemetryResponse,
  GetRecentRequestTelemetryResponse,
  GetRecentConversationResponse,
  GetTelemetryForRequestIdResponse,
  GetRequestSpanResponse,
  GetRequestLogsResponse,
} from '@palico-ai/common';
import { ConversationIDRequired, RequestIDRequired } from '../../types';

export const getRequestsByConversationId: RequestHandler<
  ConversationIDRequired,
  GetConversationTelemetryResponse
> = async (req, res, next) => {
  try {
    const conversationId = req.params['conversationId'];
    const traces = await ConversationTelemetryModel.getRequestsByConversationId(
      conversationId
    );
    if (!traces) {
      throw APIError.notFound('Traces not found');
    }
    return res.status(200).json({
      conversation: traces,
    });
  } catch (error) {
    return next(error);
  }
};

export const getRecentRequests: RequestHandler<
  unknown,
  GetRecentRequestTelemetryResponse
> = async (req, res, next) => {
  try {
    const { limit = 25, offset = 0 } = req.query;
    const traces = await ConversationTelemetryModel.getRecentRequests({
      limit: Number(limit),
      offset: Number(offset),
    });
    return res.status(200).json({
      requests: traces,
    });
  } catch (error) {
    return next(error);
  }
};

export const getRecentConversations: RequestHandler<
  unknown,
  GetRecentConversationResponse
> = async (req, res, next) => {
  try {
    const { limit = 25, offset = 0 } = req.query;
    const traces = await ConversationTelemetryModel.getRecentConversations({
      limit: Number(limit),
      offset: Number(offset),
    });
    return res.status(200).json({
      conversations: traces,
    });
  } catch (error) {
    return next(error);
  }
};

export const getRequestTelemetry: RequestHandler<
  RequestIDRequired,
  GetTelemetryForRequestIdResponse
> = async (req, res, next) => {
  try {
    const requestId = req.params['requestId'];
    const trace = await ConversationTelemetryModel.getRequestTelemetry(
      requestId
    );
    if (!trace) {
      throw APIError.notFound('Trace not found');
    }
    return res.status(200).json({
      request: trace,
    });
  } catch (error) {
    return next(error);
  }
};

export const getRequestSpans: RequestHandler<
  RequestIDRequired,
  GetRequestSpanResponse
> = async (req, res, next) => {
  try {
    const requestId = req.params['requestId'];
    const spans = await ConversationTelemetryModel.getRequestSpans(requestId);
    return res.status(200).json({
      spans,
    });
  } catch (error) {
    return next(error);
  }
};

export const getRequestLogs: RequestHandler<
  RequestIDRequired,
  GetRequestLogsResponse
> = async (req, res, next) => {
  try {
    const requestId = req.params['requestId'];
    const logs = await ConversationTelemetryModel.getRequestLogs(requestId);
    return res.status(200).json({
      logs,
    });
  } catch (error) {
    return next(error);
  }
};
