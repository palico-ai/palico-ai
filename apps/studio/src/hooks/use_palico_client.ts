'use client';

import { createProxyClient } from '@palico-ai/client-js';

export const usePalicoClient = () => {
  const client = createProxyClient({
    apiURL: "/api/palico",
  })

  return client;
};
