'use server';

import {
  CreateLabAPIRequestBody,
  CreateLabAPIResponse,
  DeleteLabAPIResponse,
  GetLabByIdAPIResponse,
  GetLabListAPIResponse,
  QuickLab,
  UpdateLabAPIRequestBody,
  UpdateLabAPIResponse,
} from '@palico-ai/common';
import { verifySession } from './auth';
import { palicoFetch } from './palico';

export const getAllLabViews = async () => {
  await verifySession();
  const response = await palicoFetch<GetLabListAPIResponse>('/studio/lab', {
    method: 'GET',
  });
  return response.labs;
};

export const getLabView = async (id: string): Promise<QuickLab> => {
  await verifySession();
  return await palicoFetch<GetLabByIdAPIResponse>(`/studio/lab/${id}`, {
    method: 'GET',
  });
};

export const createLabView = async (params: CreateLabAPIRequestBody) => {
  await verifySession();
  return await palicoFetch<CreateLabAPIResponse, CreateLabAPIRequestBody>(
    '/studio/lab',
    {
      method: 'POST',
      body: params,
    }
  );
};

export const updateLabView = async (
  id: string,
  params: UpdateLabAPIRequestBody
) => {
  await verifySession();
  return await palicoFetch<UpdateLabAPIResponse, UpdateLabAPIRequestBody>(
    `/studio/lab/${id}`,
    {
      method: 'PATCH',
      body: params,
    }
  );
};

export const deleteLabView = async (id: string) => {
  await verifySession();
  return await palicoFetch<DeleteLabAPIResponse>(`/studio/lab/${id}`, {
    method: 'DELETE',
  });
};
