'use client';

import { Box, Divider, Stack } from '@mui/material';
import React, { useContext } from 'react';
import { ChatHistory } from './chat_history';
import { ChatInput } from './chat_input';
import { ConversationContext } from '../../../context/conversation';

// const placeholderHistory : ChatMessage[] = [
//   {
//     role: 'assistant',
//     content: 'Hello! How can I help you today?'
//   },
//   {
//     role: 'user',
//     content: 'I need help with my order'
//   },
//   {
//     role: 'assistant',
//     content: 'Sure thing! What is your order number?'
//   }
// ]

const ChatUI: React.FC = () => {
  const { history, loading, sendMessage } = useContext(ConversationContext);

  const handleSend = async (message: string) => {
    await sendMessage(message, {});
  };

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="stretch"
      spacing={2}
      sx={{
        width: '100%',
        height: '100%',
        px: 4,
        py: 2,
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
        }}
      >
        <ChatHistory
          initialMessage={'Welcome to the chat!'}
          history={history}
        />
      </Box>
      {/* {errorMessage && (
        <Typography variant="caption" color={'error'}>
          {errorMessage}
        </Typography>
      )} */}
      <Divider />
      <Box>
        <ChatInput
          disabled={loading}
          placeholder={'Begin by typing a message'}
          // disabled={errorMessage !== null || loading}
          onSend={handleSend}
        />
      </Box>
    </Stack>
  );
};

export default ChatUI;
