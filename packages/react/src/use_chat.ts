'use client';

import { streamIterator } from '@palico-ai/client-js';
import { AgentResponseChunk, JSONAbleObject } from '@palico-ai/common';
import { merge } from 'lodash';
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

  const handleStreamResponse = async (reader: ReadableStreamDefaultReader) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: MessageSender.Agent,
      },
    ]);
    let responseMessageBuffer: string | undefined;
    let dataBuffer: JSONAbleObject | undefined;
    for await (const chunk of streamIterator<AgentResponseChunk>(reader)) {
      setConversationId(chunk.conversationId);
      if (chunk.delta.message) {
        if (!responseMessageBuffer) {
          responseMessageBuffer = '';
        }
        responseMessageBuffer += chunk.delta.message;
      }
      if (chunk.delta.data) {
        if (!dataBuffer) {
          dataBuffer = {};
        }
        merge(dataBuffer, chunk.delta.data);
      }
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages.pop();
        newMessages.push({
          sender: MessageSender.Agent,
          message: responseMessageBuffer,
          data: dataBuffer,
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
      const isStream = response.headers.get('transfer-encoding') === 'chunked';
      if (isStream) {
        console.log('Stream response');
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No reader');
        }
        await handleStreamResponse(reader);
      } else {
        throw new Error('Only stream responses are supported');
        const responseBody = await response.json();
        const { message, data, conversationId } = responseBody;
        setMessages((messages) => [
          ...messages,
          {
            sender: MessageSender.Agent,
            message,
            data,
          },
        ]);
        setConversationId(conversationId);
      }
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
