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
import { palicoFetch } from './palico';

export const getAllLabViews = async () => {
  const response = await palicoFetch<GetLabListAPIResponse>('/studio/lab', {
    method: 'GET',
  });
  return response.labs;
};

export const getLabView = async (id: string): Promise<QuickLab> => {
  return await palicoFetch<GetLabByIdAPIResponse>(`/studio/lab/${id}`, {
    method: 'GET',
  });
};

export const createLabView = async (params: CreateLabAPIRequestBody) => {
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
  return await palicoFetch<UpdateLabAPIResponse, UpdateLabAPIRequestBody>(
    `/studio/lab/${id}`,
    {
      method: 'PATCH',
      body: params,
    }
  );
};

export const deleteLabView = async (id: string) => {
  return await palicoFetch<DeleteLabAPIResponse>(`/studio/lab/${id}`, {
    method: 'DELETE',
  });
};
