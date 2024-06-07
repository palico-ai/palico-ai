import { Router } from 'express';
import { newConversationWorkflowHandler } from './handler';

const router = Router();

router
  .route('/:workflowName/conversation')
  .post(newConversationWorkflowHandler);

router
  .route('/:workflowName/conversation/:conversationId/reply')
  .post(newConversationWorkflowHandler);

export default router;
