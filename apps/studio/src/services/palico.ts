'server-only';

import { createClient } from '@palico-ai/client-js';
import { createAPIClient, APIFetchOptions } from '@palico-ai/client-js';
import { verifySession } from './auth/session';

interface PalicoGetClientParams {
  apiURL?: string;
  serviceKey?: string;
}

let client: ReturnType<typeof createClient> | undefined;

export async function palicoSDK(params?: PalicoGetClientParams) {
  await verifySession();
  if (!client) {
    const agentAPIURL = params?.apiURL ?? process.env.PALICO_AGENT_API_URL;
    const serviceKey = params?.serviceKey ?? process.env.PALICO_SERVICE_KEY;
    if (!agentAPIURL || !serviceKey) {
      throw new Error('Missing Palico environment variables');
    }
    client = createClient({
      apiURL: agentAPIURL,
      serviceKey,
    });
  }
  return client;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function palicoFetchJSON<Response = any, RequestBody = any>(
  path: string,
  fetchOptions: APIFetchOptions<RequestBody>
): Promise<Response> {
  await verifySession();
  const agentAPIURL = process.env.PALICO_AGENT_API_URL;
  const serviceKey = process.env.PALICO_SERVICE_KEY;
  if (!agentAPIURL || !serviceKey) {
    throw new Error('Missing Palico environment variables');
  }
  const api = createAPIClient({ rootURL: agentAPIURL, serviceKey });
  return await api.fetchJSON<Response, RequestBody>(path, fetchOptions);
}
