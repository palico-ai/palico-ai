import { ConversationRequestContentSchema } from '@palico-ai/common';
import { RequestHandler } from 'express';
import { Application } from '../../../app';

export const newConversationWorkflowHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { featureFlags, content } = req.body;
    const { workflowName } = req.params;
    await ConversationRequestContentSchema.parseAsync(content);
    const result = await Application.executeWorkflow({
      workflowName,
      content: content,
      featureFlags,
    });
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

export const replyConversationWorkflowHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { featureFlags, content } = req.body;
    const { workflowName, conversationId } = req.params;
    await ConversationRequestContentSchema.parseAsync(content);
    const result = await Application.executeWorkflow({
      workflowName,
      content: content,
      featureFlags,
      conversationId,
    });
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};
