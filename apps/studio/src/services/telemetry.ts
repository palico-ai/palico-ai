'use server';

import { verifySession } from './auth';
import { palicoFetch } from './palico';

export interface GetTraceIdsForConversationResponse {
  traceIds: string[];
}

export const getTraceIdsForConversation = async (
  conversationId: string
): Promise<GetTraceIdsForConversationResponse> => {
  await verifySession();
  return await palicoFetch(`/telemetry/conversation/${conversationId}`, {
    method: 'GET',
  });
};
