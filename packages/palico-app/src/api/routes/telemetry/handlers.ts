import { RequestHandler } from 'express';
import { ConversationTracker } from '../../../services/database/conversation_tracker';
import { APIError } from '../../error';
import {
  GetTracesByConversationResponse,
  GetConversationRequestTraces,
  GetRecentConversationResponse,
  GetTraceForRequestIdResponse,
} from '@palico-ai/common';
import { ConversationIDRequired, RequestIDRequired } from '../../types';

export const getTracesByConversationId: RequestHandler<
  ConversationIDRequired,
  GetTracesByConversationResponse
> = async (req, res, next) => {
  try {
    const conversationId = req.params['conversationId'];
    const traces = await ConversationTracker.getTracesByConversationId(
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

export const getRecentTraces: RequestHandler<
  unknown,
  GetConversationRequestTraces
> = async (req, res, next) => {
  try {
    const { limit = 25, offset = 0 } = req.query;
    const traces = await ConversationTracker.getRecentTraces({
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
    const traces = await ConversationTracker.getRecentConversations({
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

export const getTraceForRequestId: RequestHandler<
  RequestIDRequired,
  GetTraceForRequestIdResponse
> = async (req, res, next) => {
  try {
    const requestId = req.params['requestId'];
    const trace = await ConversationTracker.getTraceForRequestId(requestId);
    if (!trace) {
      throw APIError.notFound('Trace not found');
    }
    return res.status(200).json({
      request: trace,
    });
  } catch (error) {
    return next(error);
  }
}