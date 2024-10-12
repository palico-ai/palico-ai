import { Router } from 'express';
import {
  getRecentExecutionsHandler,
  getWorkflowByNameHandler,
  newConversationWorkflowHandler,
} from './handler';

const router = Router();

router.route('/:workflowName').get(getWorkflowByNameHandler);

router.route('/:workflowName/request').get(getRecentExecutionsHandler);

router
  .route('/:workflowName/conversation')
  .post(newConversationWorkflowHandler);

export default router;
