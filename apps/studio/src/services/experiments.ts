'use server';

import {
  CreateExperimentParams,
  CreateEvaluationParams,
  CreateEvalJobResponse,
  ExperimentMetadata,
  EvaluationMetadata,
  Evaluation,
} from '@palico-ai/common';
import { verifySession } from './auth';
import { palicoFetch } from './palico';

export const getExperimentList = async (): Promise<ExperimentMetadata[]> => {
  await verifySession();
  const data = await palicoFetch('/dev/experiments', {
    method: 'GET',
  });
  return data.experiments;
};

export const createExperiment = async (params: CreateExperimentParams) => {
  await verifySession();
  return await palicoFetch('/dev/experiments', {
    method: 'POST',
    body: JSON.stringify(params),
  });
};

export const deleteExperiment = async (name: string) => {
  await verifySession();
  return await palicoFetch(`/dev/experiments/${name}`, {
    method: 'DELETE',
  });
};

export const getEvalsForExperiments = async (
  expName: string
): Promise<EvaluationMetadata[]> => {
  await verifySession();
  const data = await palicoFetch(`/dev/experiments/${expName}/evals`, {
    method: 'GET',
  });
  return data.tests;
};

export const getExperimentByName = async (
  expName: string
): Promise<ExperimentMetadata> => {
  await verifySession();
  return await palicoFetch(`/dev/experiments/${expName}`, {
    method: 'GET',
  });
};

export const runEval = async (params: CreateEvaluationParams) => {
  await verifySession();
  return await palicoFetch<CreateEvalJobResponse>(
    `/dev/experiments/${params.experimentName}/evals`,
    {
      method: 'POST',
      body: JSON.stringify({
        evalName: params.evalName,
        description: params.description,
        featureFlags: params.featureFlags,
        agentName: params.agentName,
        workflowName: params.workflowName,
        testSuiteName: params.testSuiteName,
      }),
    }
  );
};

export const getEvalByName = async (expName: string, testName: string) => {
  await verifySession();
  return await palicoFetch<Evaluation>(
    `/dev/experiments/${expName}/evals/${testName}`,
    {
      method: 'GET',
    }
  );
};

export const getEvalStatus = async (expName: string, testName: string) => {
  await verifySession();
  return await palicoFetch<EvaluationMetadata['status']>(
    `/dev/experiments/${expName}/evals/${testName}/status`,
    {
      method: 'GET',
    }
  );
};
