'use client';

import { Box, Divider, Stack } from '@mui/material';
import React, { useContext, useMemo } from 'react';
import { ChatHistory } from './chat_history';
import { ChatInput } from './chat_input';
import { ConversationContext } from '../../../../context/conversation';
import ToolExecutionInput from './tool_execution_input';
import { ReplyToToolCallParams } from '@palico-ai/client-js';
import { AppConfig, AgentRequestContent } from '@palico-ai/common';

const ChatUI: React.FC = () => {
  const { history, loading, sendMessage } = useContext(ConversationContext);

  const handleSend = async (
    content: AgentRequestContent,
    appConfig: AppConfig
  ) => {
    await sendMessage(content, appConfig);
  };

  const handleSubmitToolOutput = async (
    output: ReplyToToolCallParams['toolOutputs']
  ) => {
    throw new Error('Not implemented');
    // await replyToToolCall(output);
  };

  const requiredToolCalls = useMemo(() => {
    return false;
    // const lastMessage = history[history.length - 1];
    // if (!lastMessage) {
    //   return
    // }
    // return lastMessage.role === 'assistant' && lastMessage.tool_calls;
  }, []);

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="stretch"
      spacing={2}
      sx={{
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          paddingX: 2,
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
        {requiredToolCalls ? (
          <ToolExecutionInput
            // toolCalls={requiredToolCalls}
            toolCalls={[]}
            handleSubmit={handleSubmitToolOutput}
          />
        ) : (
          <ChatInput
            disabled={loading}
            placeholder={'Begin by typing a message'}
            onSend={handleSend}
          />
        )}
      </Box>
    </Stack>
  );
};

export default ChatUI;
