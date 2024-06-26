import { RequestHandler } from 'express';
import ExperimentModel from '../../../experiments/model';
import JobQueue from '../../../services/job_queue';
import { ExperimentExecutor } from '../../../experiments/executor';
import { APIError } from '../../error';
import {
  CreateEvalJobResponse,
  CreateEvaluationParams,
  CreateExperimentParams,
  ExperimentMetadata,
} from '@palico-ai/common';

type ExperimentRouteParams = {
  expName: string;
};

type EvalRouteParams = ExperimentRouteParams & {
  evalName: string;
};

type JobRouteParams = {
  jobId: string;
};

export const newExperimentRouteHandler: RequestHandler<
  unknown,
  ExperimentMetadata,
  CreateExperimentParams
> = async (req, res, next) => {
  try {
    const { name } = req.body;
    const experiment = await ExperimentModel.createNewExperiment({ name });
    return res.status(200).json(experiment);
  } catch (error) {
    return next(error);
  }
};

export const getAllExperimentsRouteHandler: RequestHandler = async (
  _,
  res,
  next
) => {
  try {
    const experiments = await ExperimentModel.getAllExperiments();
    return res.status(200).json({ experiments });
  } catch (error) {
    return next(error);
  }
};

export const createEvalForExperimentHandler: RequestHandler<
  ExperimentRouteParams,
  CreateEvalJobResponse,
  CreateEvaluationParams
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
  ExperimentRouteParams
> = async (req, res, next) => {
  try {
    const { expName } = req.params;
    const experiment = await ExperimentModel.findExperimentByName(expName);
    return res.status(200).json(experiment);
  } catch (error) {
    return next(error);
  }
};

export const getJobStatusHandler: RequestHandler<JobRouteParams> = async (
  req,
  res,
  next
) => {
  try {
    const { jobId } = req.params;
    const job = await JobQueue.boss().getJobById(jobId);
    return res.status(200).json({ jobStatus: job?.state });
  } catch (error) {
    return next(error);
  }
};

export const getAllEvalForExperimentHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { expName } = req.params;
    const tests = await ExperimentModel.getEvalsInExperiment(expName);
    return res.status(200).json({ tests });
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

export const getEvalStatusHandler: RequestHandler<EvalRouteParams> = async (
  req,
  res,
  next
) => {
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

export const removeExperimentHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { expName } = req.params;
    await ExperimentModel.removeExperiment(expName);
    return res.status(200).json({ message: 'Experiment removed' });
  } catch (error) {
    return next(error);
  }
};
