import {
  ConversationRequestContentSchema,
  WorkflowConverationAPIRequestBody,
  WorkflowRequestAPIResponse,
} from '@palico-ai/common';
import { RequestHandler } from 'express';
import { Application } from '../../../app';

interface WorkflowRouteParams {
  workflowName: string;
}

interface WorkflowConversationRouteParams {
  workflowName: string;
  conversationId: string;
}

export const newConversationWorkflowHandler: RequestHandler<
  WorkflowRouteParams,
  WorkflowRequestAPIResponse,
  WorkflowConverationAPIRequestBody
> = async (req, res, next) => {
  try {
    const { appConfig, content } = req.body;
    const { workflowName } = req.params;
    await ConversationRequestContentSchema.parseAsync(content);
    const result = await Application.executeWorkflow({
      workflowName,
      content: content,
      appConfig,
    });
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

export const replyConversationWorkflowHandler: RequestHandler<
  WorkflowConversationRouteParams,
  WorkflowRequestAPIResponse,
  WorkflowConverationAPIRequestBody
> = async (req, res, next) => {
  try {
    const { appConfig, content } = req.body;
    const { workflowName, conversationId } = req.params;
    await ConversationRequestContentSchema.parseAsync(content);
    const result = await Application.executeWorkflow({
      workflowName,
      content: content,
      appConfig,
      conversationId,
    });
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};
