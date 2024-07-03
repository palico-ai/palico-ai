import { Router } from 'express';
import {
  getRecentConversations,
  getRecentRequests,
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

export default router;
