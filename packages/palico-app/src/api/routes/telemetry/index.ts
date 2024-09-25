import { Router } from 'express';
import {
  getRecentConversations,
  getRecentRequests,
  getRequestLogs,
  getRequestSpans,
  getRequestTelemetry,
  getRequestsByConversationId,
} from './handlers';

const router = Router();

router.route('/conversation').get(getRecentConversations);

router
  .route('/traces/conversation/:conversationId')
  .get(getRequestsByConversationId);

router.route('/request').get(getRecentRequests);

router.route('/request/:requestId').get(getRequestTelemetry);

router.route('/request/:requestId/spans').get(getRequestSpans);

router.route('/request/:requestId/logs').get(getRequestLogs);

export default router;
