import { RequestHandler } from 'express';
import { HealthCheckResponse } from '@palico-ai/common';

export const healthCheckRequestHandler: RequestHandler<
  undefined,
  HealthCheckResponse
> = async (_, res) => {
  return res.status(200).json({ status: 'ok' });
};
