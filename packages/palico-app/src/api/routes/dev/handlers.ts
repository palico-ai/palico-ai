import { RequestHandler } from 'express';
import ExperimentModel from '../../../experiments/model';
import JobQueue from '../../../services/job_queue';
import { ExperimentExecutor } from '../../../experiments/executor';
import { APIError } from '../../error';

export const createNewExperimentHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { name } = req.body;
    const experiment = await ExperimentModel.createNewExperiment({ name });
    return res.status(200).json(experiment);
  } catch (error) {
    return next(error);
  }
};

export const getAllExperimentsHandler: RequestHandler = async (
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

export const createTestForExperimentHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { expName } = req.params;
    const {
      testName,
      description,
      featureFlags,
      agentName,
      workflowName,
      testCaseDatasetName,
    } = req.body;
    const test = await ExperimentExecutor.startTestJob({
      experimentName: expName,
      testName,
      description,
      featureFlags,
      agentName,
      workflowName,
      testCaseDatasetName,
    });
    return res.status(200).json(test);
  } catch (error) {
    return next(error);
  }
};

export const getExperimentByNameHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { expName } = req.params;
    const experiment = await ExperimentModel.findExperimentByName(expName);
    return res.status(200).json(experiment);
  } catch (error) {
    return next(error);
  }
};

export const getJobStatusHandler: RequestHandler = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    console.log(jobId);
    const job = await JobQueue.boss().getJobById(jobId);
    console.log(job);
    console.log(job?.state);
    return res.status(200).json({ jobStatus: job?.state });
  } catch (error) {
    return next(error);
  }
};

export const getAllTestForExperimentHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { expName } = req.params;
    const tests = await ExperimentModel.getTestsInExperiment(expName);
    return res.status(200).json({ tests });
  } catch (error) {
    return next(error);
  }
};

export const getTestByNameHandler: RequestHandler = async (req, res, next) => {
  try {
    const { expName, testName } = req.params;
    const test = await ExperimentModel.findTest(expName, testName);
    return res.status(200).json(test);
  } catch (error) {
    return next(error);
  }
};

export const getTestStatusHandler: RequestHandler = async (req, res, next) => {
  try {
    const { testName, expName } = req.params;
    const test = await ExperimentModel.findTest(expName, testName);
    if (!test) {
      throw APIError.notFound('Test not found');
    }
    return res.status(200).json(test.status);
  } catch (error) {
    return next(error);
  }
};
