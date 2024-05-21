import { ConversationRequestContentSchema } from '@palico-ai/common';
import { RequestHandler } from 'express';
import { Application } from '../../../app';

export const runWorkflowHandler: RequestHandler = async (req, res, next) => {
  try {
    const { featureFlags, content } = req.body;
    const { workflowName } = req.params;
    await ConversationRequestContentSchema.parseAsync(content);
    const result = await Application.runWorkflow({
      workflowName,
      input: content,
      featureFlags,
    });
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};
