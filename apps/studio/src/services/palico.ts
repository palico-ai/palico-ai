import { createClient } from '@palico-ai/client-js';

interface PalicoGetClientParams {
  apiURL?: string;
  serviceKey?: string;
}

export class PalicoService {
  static getClient(params?: PalicoGetClientParams) {
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
}
