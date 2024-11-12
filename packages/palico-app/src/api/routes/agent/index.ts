import { Router } from 'express';
import {
  newConversationRequestHandler,
  replyToConversationRequestHandler,
} from './handlers';

const router = Router();

/**
 * @swagger
 *
 * /agent/{agentName}/conversation:
 *   post:
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: agentName
 *        in: path
 *        required: true
 *        type: string
 *        description: The name of the agent. This reflects the agent's folder name
 *     requestBody:
 *      content:
 *       application/json:
 *       schema:
 *       type: object
 *       properties:
 *          message:
 *           type: string
 *          description: The message to send to the agent
 *    responses:
 *
 */
router.route('/:agentName/conversation').post(newConversationRequestHandler);

router
  .route('/:agentName/conversation/:conversationId/reply')
  .post(replyToConversationRequestHandler);

export default router;
