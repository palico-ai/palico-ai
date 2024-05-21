import { Router } from 'express';
import { SpanStatusCode, trace } from '@opentelemetry/api';
import { APIError } from '../error';
import { AgentModel } from '../../agent/model';
// import { AgentRequest } from '@palico-ai/common';

const tracer = trace.getTracer('telemetry-router');

const router = Router();

router.route('/conversation/:conversationId').get(async (req, res) => {
  tracer.startActiveSpan(
    '(GET) /telemetry/conversation/:conversationId',
    async (requestSpan) => {
      requestSpan.setAttribute('requestId', req.params.conversationId);
      const conversationId = req.params.conversationId;
      const traceIds = await AgentModel.getTracesByConversationId(
        conversationId
      );
      if (!traceIds) {
        const message = "Traces not found"
        requestSpan.setStatus({
          code: SpanStatusCode.ERROR,
          message,
        });
        throw APIError.notFound(message);
      }
      requestSpan.end();
      return res.status(200).json({
        traceIds
      });
    }
  );
});

export default router;
