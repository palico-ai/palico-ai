'use client';

import React, { useEffect, useMemo } from 'react';
import { Box, Divider } from '@mui/material';
import { SyntaxHighlighter, Typography } from '@palico-ai/components';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content?: string;
}

export type ConversationHistoryItem = {
  role: 'user' | 'assistant' | 'tool';
  message?: string;
  data?: Record<string, unknown>;
};

export interface ChatHistoryProps {
  initialMessage?: string;
  history: ConversationHistoryItem[];
}

interface ChatHistoryUIItemProps {
  role: 'user' | 'assistant';
  message?: string;
  data?: Record<string, unknown>;
}

type ChatListItemProps = ChatHistoryUIItemProps & {
  itemRef?: React.Ref<unknown> | undefined;
};

const ChatListItem: React.FC<ChatListItemProps> = (item) => {
  const { role, message, data, itemRef } = item;

  const roleLabel = useMemo(() => {
    if (role === 'user') {
      return 'User Message';
    }
    return 'Assistant';
  }, [role]);

  const contentUI = useMemo(() => {
    return (
      <Box>
        {message && (
          <Typography variant="body1" whiteSpace={'pre-wrap'}>
            {message}
          </Typography>
        )}
        {data && (
          <Box>
            <Divider>Data</Divider>
            <SyntaxHighlighter language="json">
              {JSON.stringify(data, null, 2)}
            </SyntaxHighlighter>
          </Box>
        )}
      </Box>
    );
  }, [data, message]);

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
          message: item.message,
          data: item.data,
        });
      }
      if (item.role === 'assistant') {
        reformattedHistory.push({
          role: 'assistant',
          message: item.message,
          data: item.data,
        });
      } else if (item.role === 'tool') {
        throw new Error('Toolcall not supported');
        // const lastAssistantMessage =
        //   reformattedHistory[reformattedHistory.length - 1];
        // if (lastAssistantMessage.toolCalls === undefined) {
        //   throw new Error('Tool call without assistant message');
        // }
        // const toolItem = lastAssistantMessage.toolCalls.find(
        //   (toolCall) => toolCall.id === item.tool_call_id
        // );
        // if (!toolItem) {
        //   throw new Error('Tool call not found');
        // }
        // toolItem.result = JSON.parse(item.content as string);
      }
    });
    return reformattedHistory;
  }, [history]);

  useEffect(() => {
    if (lastMessageEl) {
      console.log('Scrolling to last message');
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
