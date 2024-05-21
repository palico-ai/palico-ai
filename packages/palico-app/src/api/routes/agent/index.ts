import { Router } from 'express';
import {
  getConversationTracesRequestHandler,
  newConversationRequestHandler,
  replyToConversationRequestHandler,
} from './handlers';


const router = Router();

router.route('/:agentName/conversation').post(newConversationRequestHandler);

router
  .route('/:agentName/conversation/:conversationId/trace')
  .get(getConversationTracesRequestHandler);

router
  .route('/:agentName/conversation/:conversationId/reply')
  .post(replyToConversationRequestHandler);

export default router;
