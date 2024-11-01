'use client';

import React, { useEffect, useMemo } from 'react';
import { Box, Chip, Divider } from '@mui/material';
import { Markdown, SyntaxHighlighter } from '@palico-ai/components';
import { Message, MessageSender } from '@palico-ai/react';

export interface ChatHistoryProps {
  initialMessage?: string;
  history: Message[];
}

type ChatListItemProps = Message & {
  itemRef?: React.Ref<unknown> | undefined;
};

const ChatListItem: React.FC<ChatListItemProps> = (item) => {
  const { sender, message, data, itemRef } = item;

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
        alignItems: sender === MessageSender.User ? 'flex-end' : 'flex-start',
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
              sender === MessageSender.User ? 'flex-end' : 'flex-start',
          }}
        >
          <Chip
            sx={{
              borderRadius: 2,
            }}
            label={sender === MessageSender.User ? 'You' : 'Agent'}
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

  useEffect(() => {
    if (lastMessageEl) {
      console.log('Scrolling to last message');
      lastMessageEl.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    }
  }, [history]);

  return (
    <Box>
      {history.length === 0 && initialMessage && (
        <ChatListItem
          sender={MessageSender.Agent}
          message={initialMessage}
          itemRef={setLastMessageEl}
        />
      )}
      {history.map((message, index) => {
        const isLastMessage = index === history.length - 1;
        return (
          <ChatListItem
            key={index}
            itemRef={isLastMessage ? setLastMessageEl : undefined}
            {...message}
          />
        );
      })}
    </Box>
  );
};
