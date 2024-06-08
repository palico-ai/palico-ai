import { trace } from '@opentelemetry/api';
import { RequestHandler } from 'express';
import { recordRequestErrorSpan } from '../../../utils/api';
import { Application } from '../../../app/app';
import { ConversationResponse } from '@palico-ai/common';

const tracer = trace.getTracer('agent-route-handler');

export const newConversationRequestHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  return await tracer.startActiveSpan(
    '(POST) /agent/:agentId/conversation',
    async (requestSpan) => {
      const { agentName } = req.params;
      const { content, featureFlags } = req.body;
      requestSpan.setAttributes({
        agentName,
        body: JSON.stringify(req.body, null, 2),
      });
      try {
        const agentResponse = await Application.chat({
          agentName,
          content,
          featureFlags,
          traceId: requestSpan.spanContext().traceId,
        });
        return res.status(200).json(agentResponse);
      } catch (error) {
        recordRequestErrorSpan(error, requestSpan);
        return next(error);
      } finally {
        requestSpan.end();
      }
    }
  );
};

export const replyToConversationRequestHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  return await tracer.startActiveSpan(
    '(POST) /agent/:agentId/conversation',
    async (requestSpan) => {
      try {
        const { conversationId, agentName } = req.params;
        const { content, featureFlags } = req.body;
        requestSpan.setAttributes({
          agentName,
          conversationId,
          body: JSON.stringify(req.body, null, 2),
        });
        console.log('Calling Application.chat');
        const agentResponse = await Application.chat({
          conversationId,
          agentName,
          content,
          featureFlags,
          traceId: requestSpan.spanContext().traceId,
        });
        const responseJSON: ConversationResponse = {
          ...agentResponse,
          conversationId,
        };
        console.log('Returning response', responseJSON);
        return res.status(200).json(responseJSON);
      } catch (error) {
        recordRequestErrorSpan(error, requestSpan);
        return next(error);
      } finally {
        requestSpan.end();
      }
    }
  );
};
