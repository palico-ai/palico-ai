import { Router } from 'express';
import { getRecentConversations, getRecentTraces, getTracesByConversationId } from './handlers';

const router = Router();

router.route('/traces').get(getRecentTraces);

router.route('/traces/conversation').get(getRecentConversations);

router
  .route('/traces/conversation/:conversationId')
  .get(getTracesByConversationId);

export default router;
