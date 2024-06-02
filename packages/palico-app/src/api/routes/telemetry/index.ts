import { Router } from 'express';
import { getRecentConversations, getRecentTraces, getTraceForRequestId, getTracesByConversationId } from './handlers';

const router = Router();

router.route('/traces').get(getRecentTraces);

router.route('/traces/conversation').get(getRecentConversations);

router
  .route('/traces/conversation/:conversationId')
  .get(getTracesByConversationId);

router.route('/traces/request/:requestId').get(getTraceForRequestId);

export default router;
