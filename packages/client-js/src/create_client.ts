import { CreateClientParams } from './types';
import { createAPIClient } from './request';

import { agent } from './agent';

const api = (config: CreateClientParams) => {
  const { apiURL, serviceKey } = config;
  const apiClient = createAPIClient({ rootURL: apiURL, serviceKey });
  return {
    get: async <R = any>(path: string) => {
      return await apiClient.fetchJSON<R, undefined>(path, { method: 'GET' });
    },
    post: async <R = any, B = any>(path: string, body: B) => {
      return await apiClient.fetchJSON<R, B>(path, { method: 'POST', body });
    },
  };
};

export const createClient = (config: CreateClientParams) => {
  return {
    agent: agent(config),
    api: api(config),
  };
};
