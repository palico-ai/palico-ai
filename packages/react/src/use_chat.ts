'use client';

import {
  AgentResponseStreamReader,
  IntermediateStep,
  JSONAbleObject,
  ToolCall,
  ToolCallResult,
} from '@palico-ai/common';
import { useEffect, useMemo, useState } from 'react';
import {
  ChatError,
  ChatSendMessageParams,
  Message,
  MessageSender,
  ToolCallWithResult,
  UseChatParams,
  UseChatReturn,
} from './types';

export const useChat = (params: UseChatParams): UseChatReturn => {
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
      // no messages yet
      if (messages.length === 0) return;
      // last message was from user
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === MessageSender.User) {
        return;
      }
      // agent requested no tool calls
      if (
        lastMessage.sender === MessageSender.Agent &&
        lastMessage.toolCalls === undefined
      ) {
        return;
      }
      // agent requested tool calls but we have pending tool calls
      if (pendingToolCalls.length) return;
      // agent requested tool calls and we have no pending tool calls
      // TODO: send tool call updates
      await sendToolResult();
    };

    checkAndSendToolCallUpdates();
  }, [messages, pendingToolCalls, toolCallResults]);

  const addToolCallResult = (toolCall: ToolCall, result: JSONAbleObject) => {
    console.log('Adding tool call result', toolCall, result);
    const newToolCallResults = [...toolCallResults].filter(
      (toolCallResult) => toolCallResult.toolCall.id !== toolCall.id
    );
    newToolCallResults.push({ toolCall, result });
    console.log('New tool call results', newToolCallResults);
    setToolCallResults(newToolCallResults);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentName]);

  const streamMessageStateUpdate = async (response: Response) => {
    try {
      if (response.status !== 200) {
        throw new Error(`Unexpected response status: ${response.statusText}`);
      }
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: MessageSender.Agent,
          requestId: '',
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
            requestId: chunk.requestId,
            message: mergedContent.message,
            data: mergedContent.data,
            toolCalls: mergedContent.toolCalls,
            intermediateSteps: mergedContent.intermediateSteps,
          });
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Error streaming message state update', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unable to stream message state update';
      setError({ message: errorMessage });
    }
  };

  const sendToolResult = async () => {
    setError(undefined);
    console.log('Sending tool result');
    setLoading(true);
    setToolCallResults([]);
    setMessages((messages) => [
      ...messages,
      {
        sender: MessageSender.User,
        toolCallResults,
      },
    ]);
    try {
      const results: ToolCallResult[] = toolCallResults.map(
        (toolCallResult) => ({
          id: toolCallResult.toolCall.id,
          result: toolCallResult.result,
        })
      );
      const response = await fetch(apiURL, {
        method: 'POST',
        body: JSON.stringify({
          conversationId,
          agentName,
          toolCallResults: results,
        }),
      });
      await streamMessageStateUpdate(response);
    } catch (error) {
      console.error('Error sending tool result', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unable to send tool result';
      setError({ message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (sendMessageParams: ChatSendMessageParams) => {
    setError(undefined);
    console.log('Calling sendMessage');
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
      console.log(`response`, response);
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
