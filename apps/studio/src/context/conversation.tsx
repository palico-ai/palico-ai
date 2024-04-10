'use client'

import { createClient } from '@palico-ai/client-js';
import { AgentResponse } from '@palico-ai/common';
import React, { useMemo, useState } from 'react';

export type ConversationHistoryItem = Omit<AgentResponse, 'conversationId'>;

export type ConversationContextParams = {
  loading: boolean;
  history: ConversationHistoryItem[];
  sendMessage: (
    message: string,
    context: Record<string, unknown>
  ) => Promise<void>;
};

export const ConversationContext =
  React.createContext<ConversationContextParams>({
    loading: false,
    history: [],
    sendMessage: async () => {
      return;
    },
  });

export interface ConversationContextProviderProps {
  children: React.ReactNode;
  apiURL: string;
  serviceKey: string;
}

export const ConversationContextProvider: React.FC<
  ConversationContextProviderProps
> = ({ children, apiURL, serviceKey }) => {
  const [loading, setLoading] = React.useState(false);
  const [history, setHistory] = React.useState<ConversationHistoryItem[]>([]);
  const [conversationId, setConversationId] = useState<number>();

  const client = useMemo(() => {
    return createClient({
      apiURL,
      serviceKey,
    });
  }, [apiURL, serviceKey]);

  const sendMessage = async (
    message: string,
    context: Record<string, unknown>
  ): Promise<void> => {
    console.log(apiURL, serviceKey);
    setLoading(true);
    setHistory([
      ...history,
      {
        message: {
          content: message,
          role: 'user',
        },
        finishReason: 'stop',
      },
    ]);
    try {
      let response: AgentResponse;
      if (conversationId) {
        response = await client.replyAsUser({
          message,
          context,
          conversationId,
        });
      } else {
        response = await client.newConversation({
          message,
          context,
        });
        setConversationId(response.conversationId);
      }
      setHistory((current) => [...current, response]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConversationContext.Provider value={{ loading, history, sendMessage }}>
      {children}
    </ConversationContext.Provider>
  );
};
