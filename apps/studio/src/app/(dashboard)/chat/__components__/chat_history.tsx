'use client';

import React, { useEffect, useMemo } from 'react';
import { Box, Chip, Divider } from '@mui/material';
import { Markdown, SyntaxHighlighter } from '@palico-ai/components';

export enum HistoryChatRole {
  User = 'user',
  Assistant = 'assistant',
  Tool = 'tool',
}

export interface ChatMessage {
  role: HistoryChatRole;
  content?: string;
}

export type ConversationHistoryItem = {
  role: HistoryChatRole;
  message?: string;
  data?: Record<string, unknown>;
};

export interface ChatHistoryProps {
  initialMessage?: string;
  history: ConversationHistoryItem[];
}

interface ChatHistoryUIItemProps {
  role: HistoryChatRole;
  message?: string;
  data?: Record<string, unknown>;
}

type ChatListItemProps = ChatHistoryUIItemProps & {
  itemRef?: React.Ref<unknown> | undefined;
};

const ChatListItem: React.FC<ChatListItemProps> = (item) => {
  const { role, message, data, itemRef } = item;

  const contentUI = useMemo(() => {
    return (
      <Box>
        {message && <Markdown>{message}</Markdown>}
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
        py: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: role === HistoryChatRole.User ? 'flex-end' : 'flex-start',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          flexDirection: 'column',
          // flexDirection: 'row',
          // alignItems: 'flex-start',
          maxWidth: '70%',
        }}
      >
        <Box
          sx={{
            alignSelf:
              role === HistoryChatRole.User ? 'flex-end' : 'flex-start',
          }}
        >
          <Chip
            sx={{
              borderRadius: 2,
            }}
            label={role === HistoryChatRole.User ? 'You' : 'Agent'}
            variant="filled"
          />
        </Box>
        {contentUI}
      </Box>
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
          role: HistoryChatRole.User,
          message: item.message,
          data: item.data,
        });
      }
      if (item.role === 'assistant') {
        reformattedHistory.push({
          role: HistoryChatRole.Assistant,
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
          role={HistoryChatRole.Assistant}
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
