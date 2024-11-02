import { RequestHandler } from 'express';
import { AgentModel } from '../../..//agent/model';
import WorkflowModel from '../../../models/workflow';
import {
  GetAgentMetadataResponse,
  GetAllEvalsResponse,
  GetAllTestSuitesResponse,
  GetWorkflowMetadataResponse,
  MetadataListItemCommon,
} from '@palico-ai/common';
import ExperimentModel from '../../../experiments/model';
import TestSuiteModel from '../../../experiments/test_suite/model';

export const getAgentMetadataHandler: RequestHandler<
  unknown,
  GetAgentMetadataResponse
> = async (_, res, next) => {
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

export const getAllWorkflowsMetadataHandler: RequestHandler<
  unknown,
  GetWorkflowMetadataResponse
> = async (_, res, next) => {
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

export const getAllTestCaseDatasets: RequestHandler<
  unknown,
  GetAllTestSuitesResponse
> = async (_, res, next) => {
  try {
    const datasetList = await TestSuiteModel.getAllTestSuites();
    const testSuites: MetadataListItemCommon[] = datasetList.map((name) => {
      return { name };
    });
    return res.status(200).json({ datasets: testSuites });
  } catch (error) {
    return next(error);
  }
};

export const getAllTestsHandler: RequestHandler<
  unknown,
  GetAllEvalsResponse
> = async (_, res, next) => {
  try {
    const tests = await ExperimentModel.getAllTests();
    return res.status(200).json({ evals: tests });
  } catch (error) {
    return next(error);
  }
};
