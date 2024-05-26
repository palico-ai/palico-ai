'use server';

import { GetAgentMetadataResponse, GetDatasetMetadataResponse, GetWorkflowMetadataResponse } from '@palico-ai/common';
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
}

export const getAllDatasets = async () => {
  await verifySession();
  const response = await palicoFetch<GetDatasetMetadataResponse>(
    '/metadata/datasets',
    {
      method: 'GET',
    }
  );
  return response.datasets;
}