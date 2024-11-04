'use client';

import {
  AgentResponseStreamReader,
  IntermediateStep,
  JSONAbleObject,
  ToolCall,
  ToolCallResult,
} from '@palico-ai/common';
import { useEffect, useMemo, useState } from 'react';

export enum MessageSender {
  User = 'user',
  Agent = 'agent',
}

export interface UserMessage {
  sender: MessageSender.User;
  message?: string;
  data?: JSONAbleObject;
  appConfig?: JSONAbleObject;
  toolCallResults?: ToolCallWithResult[];
}

export interface AgentMessage {
  sender: MessageSender.Agent;
  message?: string;
  data?: JSONAbleObject;
  toolCalls?: ToolCall[];
  intermediateSteps?: IntermediateStep[];
}

export type Message = UserMessage | AgentMessage;

export interface ToolCallWithResult {
  toolCall: ToolCall;
  result: JSONAbleObject;
}

export interface ChatSendMessageParams {
  userMessage?: string;
  payload?: any;
  appConfig?: JSONAbleObject;
}

export interface ChatError {
  message: string;
}

export interface UseChatParams {
  apiURL: string;
  agentName: string;
  initialState?: {
    messages: Message[];
    conversationId: string;
  };
}

export const useChat = (params: UseChatParams) => {
  const { agentName, apiURL } = params;
  const [messages, setMessages] = useState<Message[]>(
    params.initialState?.messages ?? []
  );
  const [_agentName, setAgentName] = useState(agentName); // used to prevent unnecessary resets
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ChatError>();
  const [conversationId, setConversationId] = useState<string | undefined>(
    params.initialState?.conversationId
  );
  const [toolCallResults, setToolCallResults] = useState<ToolCallWithResult[]>(
    []
  );

  const pendingToolCalls = useMemo(() => {
    if (messages.length === 0) return [];
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.sender === MessageSender.Agent && lastMessage.toolCalls) {
      return lastMessage.toolCalls.filter((toolCall) => {
        return !toolCallResults.some(
          (toolCallResult) => toolCallResult.toolCall.id === toolCall.id
        );
      });
    }
    return [];
  }, [messages, toolCallResults]);

  useEffect(() => {
    const checkAndSendToolCallUpdates = async () => {
      console.log('checking are there any messages to send');
      // no messages yet
      if (messages.length === 0) return;
      // last message was from user
      console.log("checking last message's sender");
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === MessageSender.User) {
        return;
      }
      console.log('checking last message tool calls');
      // agent requested no tool calls
      if (
        lastMessage.sender === MessageSender.Agent &&
        lastMessage.toolCalls === undefined
      ) {
        return;
      }
      console.log('checking pending tool calls', pendingToolCalls);
      // agent requested tool calls but we have pending tool calls
      if (pendingToolCalls.length) return;
      // agent requested tool calls and we have no pending tool calls
      console.log('Sending tool call updates');
      // TODO: send tool call updates
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: MessageSender.User,
          toolCallResults: toolCallResults,
        },
      ]);
      setToolCallResults([]);
    };

    checkAndSendToolCallUpdates();
  }, [messages, pendingToolCalls, toolCallResults]);

  const addToolCallResult = (toolCall: ToolCall, result: JSONAbleObject) => {
    const newToolCallResults = toolCallResults.filter(
      (toolCallResult) => toolCallResult.toolCall.id !== toolCall.id
    );
    setToolCallResults([...newToolCallResults, { toolCall, result }]);
  };

  const resetChat = () => {
    setMessages([]);
    setConversationId(undefined);
  };

  useEffect(() => {
    if (agentName !== _agentName) {
      setAgentName(agentName);
      resetChat();
    }
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
          toolCalls: mergedContent.toolCalls,
          intermediateSteps: mergedContent.intermediateSteps,
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
        data: sendMessageParams.payload,
        appConfig: sendMessageParams.appConfig,
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
    resetChat();
  };

  return {
    messages,
    loading,
    error,
    conversationId,
    pendingToolCalls,
    addResult: addToolCallResult,
    agentName,
    startNewConversation,
    sendMessage,
  };
};

export { type ToolCall, type ToolCallResult, type IntermediateStep };
