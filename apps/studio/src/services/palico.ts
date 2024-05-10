'use server';

import { createClient } from '@palico-ai/client-js';
import { createAgentAPIFetcher } from '@palico-ai/client-js';

interface PalicoGetClientParams {
  apiURL?: string;
  serviceKey?: string;
}

export async function getPalicoClient(params?: PalicoGetClientParams) {
  const agentAPIURL = params?.apiURL ?? process.env.PALICO_AGENT_API_URL;
  const serviceKey = params?.serviceKey ?? process.env.PALICO_SERVICE_KEY;
  if (!agentAPIURL || !serviceKey) {
    throw new Error('Missing Palico environment variables');
  }
  return createClient({
    apiURL: agentAPIURL,
    serviceKey,
  });
}

export async function palicoFetch(path: string, fetchOptions: RequestInit) {
  const agentAPIURL = process.env.PALICO_AGENT_API_URL;
  const serviceKey = process.env.PALICO_SERVICE_KEY;
  if (!agentAPIURL || !serviceKey) {
    throw new Error('Missing Palico environment variables');
  }
  const fetcher = createAgentAPIFetcher({ rootURL: agentAPIURL, serviceKey });
  return await fetcher(path, fetchOptions);
}