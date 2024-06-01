import { Router } from 'express';
import {
  newConversationRequestHandler,
  replyToConversationRequestHandler,
} from './handlers';


const router = Router();

router.route('/:agentName/conversation').post(newConversationRequestHandler);

router
  .route('/:agentName/conversation/:conversationId/reply')
  .post(replyToConversationRequestHandler);

export default router;
