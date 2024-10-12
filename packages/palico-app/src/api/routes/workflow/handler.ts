import {
  GetRecentWorkflowRequestsResponse,
  GetWorkflowBynameAPIResponse,
  WorkflowNewConverationRequestBody,
  WorkflowNodeSerialized,
  WorkflowRequestAPIResponse,
} from '@palico-ai/common';
import { RequestHandler } from 'express';
import { Application } from '../../../app';
import WorkflowModel from '../../../workflows/model';
import { ConversationTraceModel } from '../../../telemetry/conversation_trace';

interface WorkflowRouteParams {
  workflowName: string;
}

export const newConversationWorkflowHandler: RequestHandler<
  WorkflowRouteParams,
  WorkflowRequestAPIResponse,
  WorkflowNewConverationRequestBody
> = async (req, res, next) => {
  try {
    const { appConfig, input } = req.body;
    const { workflowName } = req.params;
    const result = await Application.executeWorkflow({
      workflowName,
      input,
      appConfig,
    });
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

export const getWorkflowByNameHandler: RequestHandler<
  WorkflowRouteParams,
  GetWorkflowBynameAPIResponse
> = async (req, res, next) => {
  try {
    const { workflowName } = req.params;
    const workflow = await WorkflowModel.getWorkflowByName(workflowName);
    const graph = workflow.getGraph();
    const nodes: WorkflowNodeSerialized[] = graph.nodes.map((node) => {
      return {
        id: node.id,
      };
    });
    return res.status(200).json({
      name: workflowName,
      graph: {
        nodes,
        edges: graph.edges,
      },
      templates: workflow.templates,
    });
  } catch (error) {
    return next(error);
  }
};

export const getRecentExecutionsHandler: RequestHandler<
  WorkflowRouteParams,
  GetRecentWorkflowRequestsResponse
> = async (req, res, next) => {
  try {
    const { limit = 25, offset = 0 } = req.query;
    const requests = await ConversationTraceModel.getRecentRequestsForWorkflow(
      req.params.workflowName,
      {
        limit: Number(limit),
        offset: Number(offset),
      }
    );
    return res.status(200).json({
      requests,
    });
  } catch (error) {
    return next(error);
  }
};
