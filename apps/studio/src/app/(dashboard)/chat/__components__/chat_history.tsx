'use client';

import React, { useEffect, useMemo } from 'react';
import { Box, Chip, Divider } from '@mui/material';
import {
  Accordion,
  AccordionList,
  Markdown,
  SyntaxHighlighter,
  Typography,
} from '@palico-ai/components';
import { Message, MessageSender, ToolCallWithResult } from '@palico-ai/react';
import IntermediateStepIcon from '@mui/icons-material/FiberManualRecord';
import { IntermediateStep } from '@palico-ai/common';

export interface ChatHistoryProps {
  initialMessage?: string;
  history: Message[];
}

type ChatListItemProps = Message & {
  itemRef?: React.Ref<unknown> | undefined;
};

interface IntermediateStepContentProps {
  steps: IntermediateStep[];
}

const IntermediateStepContent: React.FC<IntermediateStepContentProps> = ({
  steps,
}) => {
  return (
    <Box>
      {steps.map((step, index) => (
        <AccordionList
          key={index}
          items={[
            {
              summaryJSX: (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <IntermediateStepIcon
                    sx={{
                      fontSize: 10,
                      color: 'primary.main',
                      mr: 1,
                    }}
                  />
                  {step.name}
                </Box>
              ),
              details: (
                <Box
                  sx={{
                    width: '100%',
                  }}
                >
                  <SyntaxHighlighter language="json">
                    {JSON.stringify(step.data, null, 2)}
                  </SyntaxHighlighter>
                </Box>
              ),
            },
          ]}
        />
      ))}
    </Box>
  );
};

const ToolCallResultContent: React.FC<{ toolCalls: ToolCallWithResult[] }> = ({
  toolCalls,
}) => {
  return (
    <Box>
      {toolCalls.map((toolCall, index) => (
        <Accordion
          key={index}
          summaryJSX={toolCall.toolCall.name}
          details={
            <SyntaxHighlighter language="json">
              {JSON.stringify(toolCall.result, null, 2)}
            </SyntaxHighlighter>
          }
        />
      ))}
    </Box>
  );
};

const ChatListItem: React.FC<ChatListItemProps> = (item) => {
  const { sender, message, data, itemRef } = item;

  const contentUI = useMemo(() => {
    return (
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {message && (
          <Box
            sx={{
              width: '100%',
            }}
          >
            <Markdown>{message}</Markdown>
          </Box>
        )}
        {item.sender === MessageSender.Agent && item.intermediateSteps && (
          <Box
            sx={{
              width: '100%',
            }}
          >
            <Divider>
              <Typography variant="caption">Intermediate Steps</Typography>
            </Divider>
            <IntermediateStepContent steps={item.intermediateSteps} />
          </Box>
        )}
        {item.sender === MessageSender.User && item.toolCallResults && (
          <Box
            sx={{
              width: '100%',
            }}
          >
            <Divider>
              <Typography variant="caption">Tool Calls</Typography>
            </Divider>
            <ToolCallResultContent toolCalls={item.toolCallResults} />
          </Box>
        )}
        {data && (
          <Box
            sx={{
              width: '100%',
            }}
          >
            <Divider>
              <Typography variant="caption">Data</Typography>
            </Divider>
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
        <Box
          sx={{
            width: '100%',
          }}
        >
          {contentUI}
        </Box>
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
