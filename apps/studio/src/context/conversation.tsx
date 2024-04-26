'use client';

import { ReplyToToolCallParams, createClient } from '@palico-ai/client-js';
import { AgentResponse } from '@palico-ai/common';
import React, { useEffect, useMemo, useState } from 'react';

export type ConversationHistoryItem = {
  role: 'user' | 'assistant' | 'tool';
  message: string;
};

export type ConversationContextParams = {
  loading: boolean;
  history: ConversationHistoryItem[];
  agentId?: string;
  setAgentId: (id: string) => void;
  sendMessage: (
    message: string,
    context: Record<string, unknown>
  ) => Promise<void>;
  replyToToolCall: (
    outputs: ReplyToToolCallParams['toolOutputs']
  ) => Promise<void>;
};

export const ConversationContext =
  React.createContext<ConversationContextParams>({
    loading: false,
    history: [],
    sendMessage: async () => {
      return;
    },
    agentId: '',
    setAgentId: () => {
      return;
    },
    replyToToolCall: async () => {
      return;
    },
  });

export interface ConversationContextProviderProps {
  children: React.ReactNode;
  apiURL: string;
  serviceKey: string;
  agentId?: string;
}

// const placeholderHistory: ConversationHistoryItem[] = [
//   {
//     role: 'user',
//     content: 'Whats the weather in NYC?',
//   },
//   {
//     role: 'assistant',
//     content: null,
//     tool_calls: [
//       {
//         id: 'call_SsJDEHzPOB95Gw4Y1pWHE6Pc',
//         type: 'function',
//         function: {
//           name: 'get_weather_for_city',
//           arguments: '{"city":"NYC"}',
//         },
//       },
//     ],
//   },
//   {
//     role: 'tool',
//     tool_call_id: 'call_SsJDEHzPOB95Gw4Y1pWHE6Pc',
//     content: '"{\\n    \\"weather\\": \\"60\\"\\n}"',
//   },
//   {
//     role: 'tool',
//     tool_call_id: 'call_SsJDEHzPOB95Gw4Y1pWHE6Pc',
//     content: '"{\\n    \\"weather\\": \\"60\\"\\n}"',
//   },
//   {
//     role: 'assistant',
//     content: 'The weather in NYC is 60°F.',
//   },
// ];

export const ConversationContextProvider: React.FC<
  ConversationContextProviderProps
> = ({ children, apiURL, serviceKey, agentId: defaultAgentId }) => {
  const [loading, setLoading] = React.useState(false);
  const [agentId, setAgentId] = useState<string | undefined>(defaultAgentId);
  const [history, setHistory] = React.useState<ConversationHistoryItem[]>([]);
  // const [history, setHistory] =
  //   React.useState<ConversationHistoryItem[]>(placeholderHistory);
  const [conversationId, setConversationId] = useState<string>();

  useEffect(() => {
    setHistory([]);
    setConversationId(undefined);
  }, [agentId])

  const client = useMemo(() => {
    return createClient({
      apiURL,
      serviceKey,
    });
  }, [apiURL, serviceKey]);

  const agentResponseToHistoryItem = (
    response: AgentResponse
  ): ConversationHistoryItem => {
    if (!response.message) {
      throw new Error('Message is required -- we only support conversations');
    }
    return {
      role: response.message ? 'assistant' : 'tool',
      message: response.message,
    };
  };

  const sendMessage = async (
    message: string,
    context: Record<string, unknown>
  ): Promise<void> => {
    // TODO: This this as an input
    if (!agentId) {
      throw new Error('AgentID not set');
    }
    setLoading(true);
    setHistory([
      ...history,
      {
        role: 'user',
        message,
      },
    ]);
    try {
      let response: AgentResponse;
      if (conversationId) {
        response = await client.agents.replyAsUser({
          agentId,
          userMessage: message,
          payload: context,
          conversationId,
        });
      } else {
        response = await client.agents.newConversation({
          agentId,
          userMessage: message,
          payload: context,
        });
        setConversationId(response.conversationId);
      }
      setHistory((current) => [
        ...current,
        agentResponseToHistoryItem(response),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const replyToToolCall = async (
    outputs: ReplyToToolCallParams['toolOutputs']
  ): Promise<void> => {
    setLoading(true);
    throw new Error('Not yet implemented');
    // const toolMessages: ConversationHistoryItem[] = outputs.map((item) => {
    //   return {
    //     role: 'tool',
    //     tool_call_id: item.toolId,
    //     name: item.functionName,
    //     content: item.output ? JSON.stringify(item.output) : 'action completed',
    //   };
    // });
    // setHistory([...history, ...toolMessages]);
    try {
      // if (!conversationId) {
      //   throw new Error('No conversation ID');
      // }
      // const response = await client.replyToToolCall({
      //   agentId: "v1",
      //   conversationId,
      //   toolOutputs: outputs,
      // });
      // setHistory((current) => [
      //   ...current,
      //   agentResponseToHistoryItem(response),
      // ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConversationContext.Provider
      value={{
        loading,
        history,
        sendMessage,
        replyToToolCall,
        agentId,
        setAgentId,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};
