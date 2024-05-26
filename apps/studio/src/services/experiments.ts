'use server';

import {
  CreateExperimentParams,
  CreateExperimentTestParams,
  CreateExperimentTestJobResponse,
  ExperimentMetadata,
  ExperimentTestMetadata,
  ExperimentTest,
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

export const getTestsForExperiments = async (
  expName: string
): Promise<ExperimentTestMetadata[]> => {
  await verifySession();
  const data = await palicoFetch(`/dev/experiments/${expName}/tests`, {
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

export const runExperimentTest = async (params: CreateExperimentTestParams) => {
  await verifySession();
  return await palicoFetch<CreateExperimentTestJobResponse>(
    `/dev/experiments/${params.experimentName}/tests`,
    {
      method: 'POST',
      body: JSON.stringify({
        testName: params.testName,
        description: params.description,
        featureFlags: params.featureFlags,
        agentName: params.agentName,
        workflowName: params.workflowName,
        testCaseDatasetName: params.testCaseDatasetName,
      }),
    }
  );
};

export const getTestByName = async (expName: string, testName: string) => {
  await verifySession();
  return await palicoFetch<ExperimentTest>(
    `/dev/experiments/${expName}/tests/${testName}`,
    {
      method: 'GET',
    }
  );
}

export const getTestStatus = async (expName: string, testName: string) => {
  await verifySession();
  return await palicoFetch<ExperimentTestMetadata['status']>(
    `/dev/experiments/${expName}/tests/${testName}/status`,
    {
      method: 'GET',
    }
  );
};
