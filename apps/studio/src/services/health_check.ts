'use server';

import { HealthCheckResponse } from '@palico-ai/common';
import { palicoSDK } from './palico';

export const healthCheck = async () => {
  const client = await palicoSDK();
  return await client.api.get<HealthCheckResponse>('/health');
};
