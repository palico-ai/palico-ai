import { handleProxyRequest } from '@palico-ai/client-js';
import { getPalicoClient } from '../../../services/palico';

export async function POST(request: Request) {
  const client = await getPalicoClient();
  const data = await request.json();
  const response = await handleProxyRequest(data, client);
  return Response.json(response);
}
