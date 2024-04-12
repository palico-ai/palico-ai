'use client';

import React, { useEffect, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { ConversationHistoryItem } from '../../../context/conversation';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content?: string;
}

export interface ChatHistoryProps {
  initialMessage?: string;
  history: ConversationHistoryItem[];
}

type ChatItemToolCallProps = {
  id: string;
  functionName: string;
  arguments: Record<string, unknown>;
  result?: Record<string, unknown>;
};

interface ChatHistoryUIItemProps {
  role: 'user' | 'assistant';
  message?: string;
  toolCalls?: ChatItemToolCallProps[];
}

type ChatListItemProps = ChatHistoryUIItemProps & {
  itemRef?: React.Ref<unknown> | undefined;
};

const ChatListItem: React.FC<ChatListItemProps> = (item) => {
  const { role, message, toolCalls, itemRef } = item;

  const roleLabel = useMemo(() => {
    if (role === 'user') {
      return 'User Message';
    }
    if(toolCalls) {
      return 'Assistant (Tool)';
    }
    return 'Assistant';
  }, [role, toolCalls])

  const contentUI = useMemo(() => {
    if (message) {
      return <Typography variant="body1">{message}</Typography>;
    }
    if (toolCalls) {
      return toolCalls.map((toolCall, index) => {
        return (
          <Box key={index}>
            <Typography variant="body1">
              <code>
                {toolCall.functionName}({JSON.stringify(toolCall.arguments)})
              </code>
            </Typography>
            {toolCall.result && (
              <Typography variant="body1" sx={{ ml: 6 }}>
                <code>{String(toolCall.result)}</code>
              </Typography>
            )}
          </Box>
        );
      });
    }
    return <></>;
  }, [message, toolCalls]);

  return (
    <Box
      ref={itemRef}
      sx={{
        borderRadius: 2,
        mb: 1,
        px: 2,
        py: 1,
      }}
    >
      <Typography
        variant="body1"
        fontWeight={'bold'}
        whiteSpace={'pre-wrap'}
        sx={{ color: 'text.secondary' }}
      >
        {roleLabel}
      </Typography>
      {contentUI}
    </Box>
  );
};

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  history,
  initialMessage,
}) => {
  const [lastMessageEl, setLastMessageEl] =
    React.useState<HTMLDivElement | null>(null);

  const reformattedHistory: ChatHistoryUIItemProps[] = useMemo(() => {
    const reformattedHistory: ChatHistoryUIItemProps[] = [];
    history.forEach((item) => {
      if (item.role === 'user') {
        reformattedHistory.push({
          role: 'user',
          message: item.content as string,
        });
      }
      if (item.role === 'assistant') {
        reformattedHistory.push({
          role: 'assistant',
          message: item.content as string | undefined,
          toolCalls: item.tool_calls?.map((toolCall) => {
            return {
              id: toolCall.id,
              functionName: toolCall.function.name,
              arguments: JSON.parse(toolCall.function.arguments),
            };
          }),
        });
      } else if (item.role === 'tool') {
        const lastAssistantMessage =
          reformattedHistory[reformattedHistory.length - 1];
        if (lastAssistantMessage.toolCalls === undefined) {
          throw new Error('Tool call without assistant message');
        }
        const toolItem = lastAssistantMessage.toolCalls.find(
          (toolCall) => toolCall.id === item.tool_call_id
        );
        if (!toolItem) {
          throw new Error('Tool call not found');
        }
        toolItem.result = JSON.parse(item.content as string);
      }
    });
    return reformattedHistory;
  }, [history]);

  useEffect(() => {
    if (lastMessageEl) {
      console.log('Scrolling to last message')
      lastMessageEl.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    }
  }, [lastMessageEl, reformattedHistory]);

  return (
    <Box>
      {history.length === 0 && initialMessage && (
        <ChatListItem
          role="assistant"
          message={initialMessage}
          itemRef={setLastMessageEl}
        />
      )}
      {reformattedHistory.map((conversation, index) => {
        const isLastMessage = index === reformattedHistory.length - 1;
        return (
          <ChatListItem
            key={index}
            itemRef={isLastMessage ? setLastMessageEl : undefined}
            {...conversation}
          />
        );
      })}
    </Box>
  );
};
