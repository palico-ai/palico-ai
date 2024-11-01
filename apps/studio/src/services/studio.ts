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
import { palicoFetchJSON } from './palico';

export const getAllLabViews = async () => {
  const response = await palicoFetchJSON<GetLabListAPIResponse>('/studio/lab', {
    method: 'GET',
  });
  return response.labs;
};

export const getLabView = async (id: string): Promise<QuickLab> => {
  return await palicoFetchJSON<GetLabByIdAPIResponse>(`/studio/lab/${id}`, {
    method: 'GET',
  });
};

export const createLabView = async (params: CreateLabAPIRequestBody) => {
  return await palicoFetchJSON<CreateLabAPIResponse, CreateLabAPIRequestBody>(
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
  return await palicoFetchJSON<UpdateLabAPIResponse, UpdateLabAPIRequestBody>(
    `/studio/lab/${id}`,
    {
      method: 'PATCH',
      body: params,
    }
  );
};

export const deleteLabView = async (id: string) => {
  return await palicoFetchJSON<DeleteLabAPIResponse>(`/studio/lab/${id}`, {
    method: 'DELETE',
  });
};
