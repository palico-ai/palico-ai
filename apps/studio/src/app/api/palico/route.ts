import { handleProxyRequest } from '@palico-ai/client-js';
import { PalicoService } from '../../../services/palico';

export async function POST(request: Request) {
  const client = PalicoService.getClient();
  const data = await request.json();
  const response = await handleProxyRequest(data, client);
  return Response.json(response);
}
