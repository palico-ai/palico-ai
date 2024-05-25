import { RequestHandler } from 'express';
import { AgentModel } from '../../..//agent/model';
import WorkflowModel from '../../../models/workflow';
import DatasetModel from '../../../models/datasets';
import { GetAgentMetadataResponse, GetDatasetMetadataResponse, GetWorkflowMetadataResponse, MetadataListItemCommon } from '@palico-ai/common';

export const getAgentMetadataHandler: RequestHandler<unknown, GetAgentMetadataResponse> = async (_, res, next) => {
  try {
    const agentList = await AgentModel.getAllAgents();
    const agents: MetadataListItemCommon[] = agentList.map((name) => {
      return { name };
    });
    return res.status(200).json({ agents });
  } catch (error) {
    return next(error);
  }
};

export const getAllWorkflowsMetadataHandler: RequestHandler<unknown, GetWorkflowMetadataResponse> = async (
  _,
  res,
  next
) => {
  try {
    const workflowList = await WorkflowModel.getAllWorkflows();
    const workflows: MetadataListItemCommon[] = workflowList.map((name) => {
      return { name };
    });
    return res.status(200).json({ workflows });
  } catch (error) {
    return next(error);
  }
};

export const getDatasetMetadataHandler: RequestHandler<unknown, GetDatasetMetadataResponse>= async (
  _,
  res,
  next
) => {
  try {
    const datasetList = await DatasetModel.getAllDatasets();
    const datasets: MetadataListItemCommon[] = datasetList.map((name) => {
      return { name };
    });
    return res.status(200).json({ datasets });
  } catch (error) {
    return next(error);
  }
};
