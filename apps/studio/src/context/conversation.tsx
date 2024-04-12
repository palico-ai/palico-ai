'use client';

import { ReplyToToolCallParams, createClient } from '@palico-ai/client-js';
import { AgentResponse, OpenAIMessage } from '@palico-ai/common';
import React, { useMemo, useState } from 'react';

export type ConversationHistoryItem = OpenAIMessage;

export type ConversationContextParams = {
  loading: boolean;
  history: ConversationHistoryItem[];
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
    replyToToolCall: async () => {
      return;
    },
  });

export interface ConversationContextProviderProps {
  children: React.ReactNode;
  apiURL: string;
  serviceKey: string;
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
> = ({ children, apiURL, serviceKey }) => {
  const [loading, setLoading] = React.useState(false);
  const [history, setHistory] = React.useState<ConversationHistoryItem[]>([]);
  // const [history, setHistory] =
  //   React.useState<ConversationHistoryItem[]>(placeholderHistory);
  const [conversationId, setConversationId] = useState<number>();

  const client = useMemo(() => {
    return createClient({
      apiURL,
      serviceKey,
    });
  }, [apiURL, serviceKey]);

  const agentResponseToHistoryItem = (
    response: AgentResponse
  ): ConversationHistoryItem => {
    if (response.message.role !== 'assistant') {
      throw new Error('Agent responses must be from the assistant');
    }
    return {
      role: response.message.role,
      content: response.message.content as string | undefined,
      tool_calls: response.message.toolCalls,
    };
  };

  const sendMessage = async (
    message: string,
    context: Record<string, unknown>
  ): Promise<void> => {
    console.log(apiURL, serviceKey);
    setLoading(true);
    setHistory([
      ...history,
      {
        role: 'user',
        content: message,
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
    const toolMessages: ConversationHistoryItem[] = outputs.map((item) => {
      return {
        role: 'tool',
        tool_call_id: item.toolId,
        name: item.functionName,
        content: item.output ? JSON.stringify(item.output) : 'action completed',
      };
    });
    setHistory([...history, ...toolMessages]);
    try {
      if (!conversationId) {
        throw new Error('No conversation ID');
      }
      const response = await client.replyToToolCall({
        conversationId,
        toolOutputs: outputs,
      });
      setHistory((current) => [
        ...current,
        agentResponseToHistoryItem(response),
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConversationContext.Provider
      value={{ loading, history, sendMessage, replyToToolCall }}
    >
      {children}
    </ConversationContext.Provider>
  );
};
