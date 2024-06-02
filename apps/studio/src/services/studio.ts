'use server';

import {
  CreateQuickLabParams,
  QuickLab,
  UpdateStudioLabParams,
} from '@palico-ai/common';
import { verifySession } from './auth';
import { palicoFetch } from './palico';

export const getAllLabViews = async () => {
  await verifySession();
  return await palicoFetch('/studio/lab', {
    method: 'GET',
  });
};

export const getLabView = async (id: string): Promise<QuickLab> => {
  await verifySession();
  return await palicoFetch(`/studio/lab/${id}`, {
    method: 'GET',
  });
};

export const createLabView = async (params: CreateQuickLabParams) => {
  await verifySession();
  return await palicoFetch('/studio/lab', {
    method: 'POST',
    body: JSON.stringify(params),
  });
};

export const updateLabView = async (
  id: string,
  params: UpdateStudioLabParams
) => {
  await verifySession();
  return await palicoFetch(`/studio/lab/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
};

export const deleteLabView = async (id: string) => {
  await verifySession();
  return await palicoFetch(`/studio/lab/${id}`, {
    method: 'DELETE',
  });
};