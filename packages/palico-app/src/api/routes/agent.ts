import { Router } from 'express';
import { SpanStatusCode, trace } from '@opentelemetry/api';
import { APIError } from '../../errors';
import { AgentRequestExecutor } from '../../models/agent';
import { AgentResponse } from '@palico-ai/common';
// import { AgentRequest } from '@palico-ai/common';

const tracer = trace.getTracer('conversation-router');

const router = Router();

router.route('/:agentId/conversation').post(async (req, res) => {
  return tracer.startActiveSpan(
    '(POST) /agent/:agentId/conversation',
    async (requestSpan) => {
      const { agentId } = req.params;
      const { content, featureFlags } = req.body;
      requestSpan.setAttributes({
        agentId,
        body: JSON.stringify(req.body, null, 2),
      });
      try {
        const agentResponse = await AgentRequestExecutor.chat({
          agentId,
          content,
          featureFlags,
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
    return await tracer.startActiveSpan(
      '(POST) /agent/:agentId/conversation',
      async (requestSpan) => {
        const  { conversationId, agentId } = req.params;
        const { content, featureFlags } = req.body;
        requestSpan.setAttributes({
          agentId,
          conversationId,
          body: JSON.stringify(req.body, null, 2),
        });
        const agentResponse = await AgentRequestExecutor.chat({
          conversationId,
          agentId,
          content,
          featureFlags,
          traceId: requestSpan.spanContext().traceId,
        });
        requestSpan.end();
        const responseJSON : AgentResponse = {
          ...agentResponse,
          conversationId,
        }
        return res.status(200).json(responseJSON);
      }
    );
  });

export default router;
