import { Router } from 'express';
import { SpanStatusCode, trace } from '@opentelemetry/api';
import { getAgentById } from '../../utils/api';
import { APIError } from '../../errors';
import { uuid } from 'uuidv4';
import { AgentRequestExecutor } from '../../models/agent';
import { AgentResponse } from '@palico-ai/common';
// import { AgentRequest } from '@palico-ai/common';

const tracer = trace.getTracer('conversation-router');

const router = Router();

router.route('/:agentId/conversation').post(async (req, res) => {
  return tracer.startActiveSpan(
    '(POST) /agent/:agentId/conversation',
    async (requestSpan) => {
      requestSpan.setAttribute('body', JSON.stringify(req.body, null, 2));
      requestSpan.setAttribute('agentId', req.params.agentId);
      try {
        const agentResponse = await AgentRequestExecutor.newConversation({
          agentId: req.params.agentId,
          body: req.body,
          featureFlags: {},
          traceId: requestSpan.spanContext().traceId,
        });
        requestSpan.end();
        return res.status(200).json(agentResponse);
      } catch (error) {
        if (error instanceof APIError) {
          requestSpan.recordException(error);
          requestSpan.setStatus({ code: SpanStatusCode.ERROR });
          return res
            .status(error.statusCode)
            .json({ error: error.message ?? 'Something went wrong' });
        } else {
          requestSpan.end();
          return res.status(500).json({ error: 'Something went wrong' });
        }
      }
    }
  );
});

router
  .route('/:agentId/conversation/:conversationId/trace')
  .get(async (req, res) => {
    const conversationId = req.params['conversationId'];
    const traces = await AgentRequestExecutor.getTracesByConversationId(
      conversationId
    );
    return res.status(200).json(traces);
  });

router
  .route('/:agentId/conversation/:conversationId/reply')
  .post(async (req, res) => {
    // TODO: Move to AgentRequestExecutor model
    const requestId = uuid();
    tracer.startActiveSpan(
      '(POST) /agent/:agentId/conversation',
      async (requestSpan) => {
        const traceId = requestSpan.spanContext().traceId;
        requestSpan.setAttribute('body', JSON.stringify(req.body, null, 2));
        requestSpan.setAttribute('agentId', req.params.agentId);
        const agentId = req.params['agentId'];
        const conversationId = req.params['conversationId'];
        const agent = getAgentById(agentId);
        const { userMessage, toolOutputs, payload, featureFlags } = req.body;
        const [, response] = await Promise.all([
          AgentRequestExecutor.logRequest({
            id: requestId,
            conversationId,
            agentId,
            requestTraceId: traceId,
          }),
          agent.agent.replyToConversation(
            conversationId,
            {
              userMessage,
              toolOutputs,
              payload,
            },
            {
              requestId,
              otel: {
                traceId,
              },
              featureFlags,
            }
          ),
        ]);
        requestSpan.end();
        const responseJSON : AgentResponse = {
          ...response,
          conversationId,
        }
        return res.status(200).json(responseJSON);
      }
    );
  });

export default router;
