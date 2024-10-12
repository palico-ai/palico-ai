'use server';

import {
  GetWorkflowBynameAPIResponse,
  GetWorkflowMetadataResponse,
} from '@palico-ai/common';
import { palicoFetch } from './palico';

export const getAllWorkflows = async () => {
  const response = await palicoFetch<GetWorkflowMetadataResponse>(
    '/metadata/workflows',
    {
      method: 'GET',
    }
  );
  return response.workflows;
};

export const getWorkflowByName = async (name: string) => {
  const response = await palicoFetch<GetWorkflowBynameAPIResponse>(
    `/workflow/${name}`,
    {
      method: 'GET',
    }
  );
  return response;
};
