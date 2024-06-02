'use client';

import { ReplyToToolCallParams } from '@palico-ai/client-js';
import {
  ConversationContext as ConversationContextType,
  ConversationRequestContent,
  ConversationResponse,
} from '@palico-ai/common';
import React, { useEffect, useState } from 'react';
import { usePalicoClient } from '../hooks/use_palico_client';
import { ConversationHistoryItem } from '../app/chat/__components__/chat_history';

export type ConversationContextParams = {
  loading: boolean;
  history: ConversationHistoryItem[];
  agentId?: string;
  setAgentId: (id: string) => void;
  sendMessage: (
    content: ConversationRequestContent,
    featureFlag: ConversationContextType['featureFlags']
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
  agentId?: string;
}

export const ConversationContextProvider: React.FC<
  ConversationContextProviderProps
> = ({ children, agentId: defaultAgentId }) => {
  const [loading, setLoading] = React.useState(false);
  const [agentId, setAgentId] = useState<string | undefined>(defaultAgentId);
  const [history, setHistory] = React.useState<ConversationHistoryItem[]>([]);
  // const [history, setHistory] =
  //   React.useState<ConversationHistoryItem[]>(placeholderHistory);
  const [conversationId, setConversationId] = useState<string>();

  useEffect(() => {
    setHistory([]);
    setConversationId(undefined);
  }, [agentId]);

  const client = usePalicoClient();

  const agentResponseToHistoryItem = (
    response: ConversationResponse
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
    content: ConversationRequestContent,
    featureFlag: ConversationContextType['featureFlags']
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
        message: content.userMessage ?? '',
      },
    ]);
    try {
      let response: ConversationResponse;
      if (conversationId) {
        response = await client.agents.replyAsUser({
          agentId,
          userMessage: content.userMessage,
          payload: content.payload,
          conversationId,
          featureFlags: featureFlag,
        });
      } else {
        response = await client.agents.newConversation({
          agentId,
          userMessage: content.userMessage,
          payload: content.payload,
          featureFlags: featureFlag,
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
