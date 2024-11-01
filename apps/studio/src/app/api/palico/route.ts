import { createPalicoClient } from '@palico-ai/react';

export const maxDuration = 30;

export async function POST(req: Request) {
  const agentAPIURL = process.env.PALICO_AGENT_API_URL;
  const serviceKey = process.env.PALICO_SERVICE_KEY;
  if (!agentAPIURL || !serviceKey) {
    throw new Error('Missing Palico environment variables');
  }
  const request = await req.json();
  console.log('Input request', request);
  const client = createPalicoClient({
    apiURL: agentAPIURL,
    serviceKey: serviceKey,
  });
  const response = await client.chat({
    conversationId: request.conversationId,
    agentName: request.agentName,
    userMessage: request.userMessage,
    payload: request.payload,
    appConfig: request.appConfig,
  });
  console.log('Output response', response);
  return response;
}
