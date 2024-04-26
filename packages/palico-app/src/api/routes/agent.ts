import { Router } from 'express';
import { SpanStatusCode, trace } from '@opentelemetry/api';
import { getAgentById } from '../utils';
import { APIError } from '../../errors';
import { uuid } from 'uuidv4';
import { AgentRequest } from '../../tables/agent_request';
// import { AgentRequest } from '@palico-ai/common';

const tracer = trace.getTracer('conversation-router');

const router = Router();

router.route('/:agentId/conversation').post(async (req, res) => {
  tracer.startActiveSpan(
    '(POST) /agent/:agentId/conversation',
    async (requestSpan) => {
      requestSpan.setAttribute('body', JSON.stringify(req.body, null, 2));
      requestSpan.setAttribute('agentId', req.params.agentId);
      // TODO: Generate our own conversationId
      try {
        const requestId = uuid();
        const conversationId = requestId;
        const agentId = req.params['agentId'];
        const agent = getAgentById(agentId);
        const { userMessage, payload } = req.body;
        return tracer.startActiveSpan(
          'Executing agent->newConversation()',
          async (callAgentSpan) => {
            const traceId = callAgentSpan.spanContext().traceId;
            const [, response] = await Promise.all([
              AgentRequest.create({
                id: requestId,
                conversationId,
                agentId,
                requestTraceId: traceId,
              }),
              agent.agent.newConversation(
                conversationId,
                {
                  userMessage,
                  payload,
                },
                {
                  requestId,
                  otel: {
                    traceId,
                  },
                  featureFlags: {}
                }
              ),
            ]);
            callAgentSpan.end();
            requestSpan.setAttribute(
              'conversationId',
              response.conversationId.toString()
            );
            requestSpan.end();
            return res.status(200).json(response);
          }
        );
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
    const traces = await AgentRequest.getTracesByConversationId(conversationId);
    return res.status(200).json(traces);
  });

router
  .route('/:agentId/conversation/:conversationId/reply')
  .post(async (req, res) => {
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
        const { userMessage, toolOutputs, payload } = req.body;
        const [, response] = await Promise.all([
          AgentRequest.create({
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
              featureFlags: {}
            },
          ),
        ]);
        requestSpan.end();
        return res.status(200).json(response);
      }
    );
  });

export default router;
