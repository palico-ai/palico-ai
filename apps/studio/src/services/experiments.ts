'use server';

import {
  CreateEvaluationParams,
  ExperimentMetadata,
  Evaluation,
  CreateEvalAPIRequestBody,
  CreateEvalAPIResponse,
  NewExperimentAPIResponse,
  NewExperimentAPIRequestBody,
  GetAllExperimentsAPIResponse,
  GetExperimentByNameAPIResponse,
  GetAllEvalsAPIResponse,
  GetEvalStatusAPIResponse,
} from '@palico-ai/common';
import { verifySession } from './auth';
import { palicoFetch } from './palico';

export const getExperimentList = async (): Promise<ExperimentMetadata[]> => {
  await verifySession();
  const data = await palicoFetch<GetAllExperimentsAPIResponse>(
    '/dev/experiments',
    {
      method: 'GET',
    }
  );
  return data.experiments;
};

export const createExperiment = async (params: NewExperimentAPIRequestBody) => {
  await verifySession();
  return await palicoFetch<
    NewExperimentAPIResponse,
    NewExperimentAPIRequestBody
  >('/dev/experiments', {
    method: 'POST',
    body: params,
  });
};

export const deleteExperiment = async (name: string) => {
  await verifySession();
  return await palicoFetch(`/dev/experiments/${name}`, {
    method: 'DELETE',
  });
};

export const getEvalsForExperiments = async (expName: string) => {
  await verifySession();
  const data = await palicoFetch<GetAllEvalsAPIResponse>(
    `/dev/experiments/${expName}/evals`,
    {
      method: 'GET',
    }
  );
  return data.evals;
};

export const getExperimentByName = async (expName: string) => {
  await verifySession();
  return await palicoFetch<GetExperimentByNameAPIResponse>(
    `/dev/experiments/${expName}`,
    {
      method: 'GET',
    }
  );
};

export const runEval = async (params: CreateEvaluationParams) => {
  await verifySession();
  return await palicoFetch<CreateEvalAPIResponse, CreateEvalAPIRequestBody>(
    `/dev/experiments/${params.experimentName}/evals`,
    {
      method: 'POST',
      body: {
        evalName: params.evalName,
        description: params.description,
        appConfig: params.appConfig,
        agentName: params.agentName,
        workflowName: params.workflowName,
        testSuiteName: params.testSuiteName,
      },
    }
  );
};

export const getEvalByName = async (expName: string, evalName: string) => {
  await verifySession();
  return await palicoFetch<Evaluation>(
    `/dev/experiments/${expName}/evals/${evalName}`,
    {
      method: 'GET',
    }
  );
};

export const getEvalStatus = async (expName: string, testName: string) => {
  await verifySession();
  return await palicoFetch<GetEvalStatusAPIResponse>(
    `/dev/experiments/${expName}/evals/${testName}/status`,
    {
      method: 'GET',
    }
  );
};
