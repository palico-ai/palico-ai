'use client';

import { AgentResponseStreamReader, JSONAbleObject } from '@palico-ai/common';
import { useEffect, useState } from 'react';

export interface UseChatParams {
  apiURL: string;
  agentName: string;
}

export enum MessageSender {
  User = 'user',
  Agent = 'agent',
}

export interface Message {
  sender: MessageSender;
  message?: string;
  data?: JSONAbleObject;
}

export interface ChatSendMessageParams {
  userMessage?: string;
  payload?: any;
  appConfig?: JSONAbleObject;
}

export interface ChatError {
  message: string;
}

export const useChat = (params: UseChatParams) => {
  const { agentName, apiURL } = params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ChatError>();
  const [conversationId, setConversationId] = useState<string>();

  useEffect(() => {
    setMessages([]);
    setConversationId(undefined);
  }, [agentName]);

  const streamMessageStateUpdate = async (response: Response) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: MessageSender.Agent,
      },
    ]);
    const stream = new AgentResponseStreamReader(response);
    for await (const chunk of stream.readChunks()) {
      setConversationId(chunk.conversationId);
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages.pop();
        const mergedContent = stream.getMergedChunks();
        newMessages.push({
          sender: MessageSender.Agent,
          message: mergedContent.message,
          data: mergedContent.data,
        });
        return newMessages;
      });
    }
  };

  const sendMessage = async (sendMessageParams: ChatSendMessageParams) => {
    setLoading(true);
    setMessages((messages) => [
      ...messages,
      {
        sender: MessageSender.User,
        message: sendMessageParams.userMessage,
      },
    ]);
    try {
      const response = await fetch(apiURL, {
        method: 'POST',
        body: JSON.stringify({
          conversationId,
          agentName,
          userMessage: sendMessageParams.userMessage,
          payload: sendMessageParams.payload,
          appConfig: sendMessageParams.appConfig ?? {},
        }),
      });
      await streamMessageStateUpdate(response);
    } catch (error) {
      console.error('Error sending message', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unable to send message';
      setError({ message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const startNewConversation = async () => {
    setMessages([]);
    setConversationId(undefined);
  };

  return {
    messages,
    loading,
    error,
    conversationId,
    agentName,
    startNewConversation,
    sendMessage,
  };
};
