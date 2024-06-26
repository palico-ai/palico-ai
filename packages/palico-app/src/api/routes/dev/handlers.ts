import { RequestHandler } from 'express';
import ExperimentModel from '../../../experiments/model';
import { ExperimentExecutor } from '../../../experiments/executor';
import { APIError } from '../../error';
import {
  CreateEvalAPIRequestBody,
  CreateEvalAPIResponse,
  GetAllEvalsAPIResponse,
  GetAllExperimentsAPIResponse,
  GetEvalStatusAPIResponse,
  GetExperimentByNameAPIResponse,
  MessageAPIResponse,
  NewExperimentAPIRequestBody,
  NewExperimentAPIResponse,
} from '@palico-ai/common';

type ExperimentRouteParams = {
  expName: string;
};

type EvalRouteParams = ExperimentRouteParams & {
  evalName: string;
};

export const newExperimentRouteHandler: RequestHandler<
  unknown,
  NewExperimentAPIRequestBody,
  NewExperimentAPIResponse
> = async (req, res, next) => {
  try {
    const { name } = req.body;
    const experiment = await ExperimentModel.createNewExperiment({ name });
    return res.status(200).json(experiment);
  } catch (error) {
    return next(error);
  }
};

export const getAllExperimentsRouteHandler: RequestHandler<
  never,
  GetAllExperimentsAPIResponse
> = async (_, res, next) => {
  try {
    const experiments = await ExperimentModel.getAllExperiments();
    return res.status(200).json({ experiments });
  } catch (error) {
    return next(error);
  }
};

export const createEvalForExperimentHandler: RequestHandler<
  ExperimentRouteParams,
  CreateEvalAPIResponse,
  CreateEvalAPIRequestBody
> = async (req, res, next) => {
  try {
    const { expName } = req.params;
    const {
      evalName,
      description,
      appConfig,
      agentName,
      workflowName,
      testSuiteName,
    } = req.body;
    const test = await ExperimentExecutor.startTestJob({
      experimentName: expName,
      evalName,
      description,
      appConfig,
      agentName,
      workflowName,
      testSuiteName,
    });
    return res.status(200).json(test);
  } catch (error) {
    return next(error);
  }
};

export const getExperimentByNameHandler: RequestHandler<
  ExperimentRouteParams,
  GetExperimentByNameAPIResponse
> = async (req, res, next) => {
  try {
    const { expName } = req.params;
    const experiment = await ExperimentModel.findExperimentByName(expName);
    return res.status(200).json(experiment);
  } catch (error) {
    return next(error);
  }
};

export const getAllEvalForExperimentHandler: RequestHandler<
  ExperimentRouteParams,
  GetAllEvalsAPIResponse
> = async (req, res, next) => {
  try {
    const { expName } = req.params;
    const tests = await ExperimentModel.getEvalsInExperiment(expName);
    return res.status(200).json({ evals: tests });
  } catch (error) {
    return next(error);
  }
};

export const getEvalByNameHandler: RequestHandler<EvalRouteParams> = async (
  req,
  res,
  next
) => {
  try {
    const { expName, evalName } = req.params;
    const test = await ExperimentModel.findEval(expName, evalName);
    return res.status(200).json(test);
  } catch (error) {
    return next(error);
  }
};

export const getEvalStatusHandler: RequestHandler<
  EvalRouteParams,
  GetEvalStatusAPIResponse
> = async (req, res, next) => {
  try {
    const { evalName, expName } = req.params;
    const test = await ExperimentModel.findEval(expName, evalName);
    if (!test) {
      throw APIError.notFound('Eval not found');
    }
    return res.status(200).json(test.status);
  } catch (error) {
    return next(error);
  }
};

export const removeExperimentHandler: RequestHandler<
  ExperimentRouteParams,
  MessageAPIResponse
> = async (req, res, next) => {
  try {
    const { expName } = req.params;
    await ExperimentModel.removeExperiment(expName);
    return res.status(200).json({ message: 'Experiment removed' });
  } catch (error) {
    return next(error);
  }
};
