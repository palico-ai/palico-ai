import * as express from 'express';
import { LLMAgent } from '../../agent';

export const createAgentConversationRouter = (agent: LLMAgent) => {
  const router = express.Router();

  router.route('/conversation').post(async (req, res) => {
    const { userMessage, context } = req.body;
    const response = await agent.newConversation({
      userMessage,
      context,
    });
    res.status(200).json(response);
  });

  router.route('/conversation/:conversationId/reply').post(async (req, res) => {
    const conversationId = parseInt(req.params['conversationId']);
    if (isNaN(conversationId)) {
      res.status(400).json({ error: 'conversationId must be a number' });
      return;
    }
    const { userMessage, toolOutputs, context } = req.body;
    const response = await agent.replyToConversation(conversationId, {
      userMessage,
      toolOutputs,
      context,
    });
    res.status(200).json(response);
  })

  return router;
};
