'use client';

import {
  AppConfig,
  AgentRequestContent,
  AgentResponse,
} from '@palico-ai/common';
import React, { useEffect, useState } from 'react';
import { ConversationHistoryItem } from '../app/(dashboard)/chat/__components__/chat_history';
import { ConversationalEntity } from '../types/common';
import { newConversation, replyToConversation } from '../services/conversation';

export type ConversationContextParams = {
  loading: boolean;
  history: ConversationHistoryItem[];
  conversationEntity?: ConversationalEntity;
  setConversationalEntity: (entity: ConversationalEntity) => void;
  sendMessage: (
    content: AgentRequestContent,
    appConfig: AppConfig
  ) => Promise<void>;
};

export const ConversationContext =
  React.createContext<ConversationContextParams>(
    {} as ConversationContextParams
  );

export interface ConversationContextProviderProps {
  children: React.ReactNode;
  conversationEntity?: ConversationalEntity;
}

export const ConversationContextProvider: React.FC<
  ConversationContextProviderProps
> = ({ children, conversationEntity: initialConversationalEntity }) => {
  const [loading, setLoading] = React.useState(false);
  const [conversationEntity, setConversationEntity] = useState<
    ConversationalEntity | undefined
  >(initialConversationalEntity);
  const [history, setHistory] = React.useState<ConversationHistoryItem[]>([]);
  const [conversationId, setConversationId] = useState<string>();

  useEffect(() => {
    setHistory([]);
    setConversationId(undefined);
  }, [conversationEntity]);

  const agentResponseToHistoryItem = (
    response: AgentResponse
  ): ConversationHistoryItem => {
    return {
      role: 'assistant',
      message: response.message,
      data: response.data,
    };
  };

  const sendMessage = async (
    content: AgentRequestContent,
    appConfig: AppConfig
  ): Promise<void> => {
    // TODO: This this as an input
    if (!conversationEntity) {
      throw new Error('AgentID not set');
    }
    setLoading(true);
    setHistory([
      ...history,
      {
        role: 'user',
        message: content.userMessage ?? '',
        data: content.payload,
      },
    ]);
    try {
      let response: AgentResponse;
      if (conversationId) {
        response = await replyToConversation(conversationEntity, {
          conversationId,
          userMessage: content.userMessage,
          payload: content.payload,
          appConfig: appConfig,
        });
      } else {
        response = await newConversation(conversationEntity, {
          userMessage: content.userMessage,
          payload: content.payload,
          appConfig: appConfig,
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

  return (
    <ConversationContext.Provider
      value={{
        loading,
        history,
        sendMessage,
        conversationEntity: conversationEntity,
        setConversationalEntity: setConversationEntity,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};
