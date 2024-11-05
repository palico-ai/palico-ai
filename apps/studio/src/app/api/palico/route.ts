import { createClient } from '@palico-ai/client-js';

export const maxDuration = 120;

export async function POST(req: Request) {
  const agentAPIURL = process.env.PALICO_AGENT_API_URL;
  const serviceKey = process.env.PALICO_SERVICE_KEY;
  if (!agentAPIURL || !serviceKey) {
    throw new Error('Missing Palico environment variables');
  }
  const request = await req.json();
  const client = createClient({
    apiURL: agentAPIURL,
    serviceKey: serviceKey,
  });
  console.log(`Calling agent.chat with request: ${JSON.stringify(request)}`);
  const responseStream = await client.agent.chat({
    agentName: request.agentName,
    conversationId: request.conversationId,
    userMessage: request.userMessage,
    payload: request.payload,
    toolCallResults: request.toolCallResults,
    appConfig: request.appConfig,
    stream: true,
  });
  return responseStream.response;
}
