'use server';

import {
  GetAgentMetadataResponse,
  GetAllEvalsResponse,
  GetAllTestSuitesResponse,
  GetWorkflowMetadataResponse,
} from '@palico-ai/common';
import { verifySession } from './auth';
import { palicoFetch } from './palico';

export const getAllAgents = async () => {
  await verifySession();
  const response = await palicoFetch<GetAgentMetadataResponse>(
    '/metadata/agents',
    {
      method: 'GET',
    }
  );
  return response.agents;
};

export const getAllWorkflows = async () => {
  await verifySession();
  const response = await palicoFetch<GetWorkflowMetadataResponse>(
    '/metadata/workflows',
    {
      method: 'GET',
    }
  );
  return response.workflows;
};

export const getAllTestSuites = async () => {
  await verifySession();
  const response = await palicoFetch<GetAllTestSuitesResponse>(
    '/metadata/test-case-dataset',
    {
      method: 'GET',
    }
  );
  return response.datasets;
};

export const getAllEvals = async () => {
  await verifySession();
  const response = await palicoFetch<GetAllEvalsResponse>('/metadata/tests', {
    method: 'GET',
  });
  return response.evals;
};
