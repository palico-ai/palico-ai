'use client';

import { Divider } from '@mui/material';
import { Box } from '@mui/system';
import { AgentRequestTrace } from '@palico-ai/common';
import {
  Button,
  Link,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@palico-ai/components';
import { useMemo, useState } from 'react';

export enum ChatEntity {
  User = 'User',
  Agent = 'Agent',
}

export interface ChatItemProps {
  entity: ChatEntity;
  message: string;
  data?: Record<string, unknown>;
}

const CHAT_PREVIEW_LENGTH = 250;

const ChatItem: React.FC<ChatItemProps> = (props) => {
  // TODO: Display data
  const { entity, message } = props;
  const [displayMessage, setDisplayMessage] = useState(
    message.slice(0, CHAT_PREVIEW_LENGTH)
  );

  const hasMore = useMemo(
    () => displayMessage.length < message.length,
    [displayMessage.length, message.length]
  );

  const align = entity === ChatEntity.User ? 'left' : 'right';

  return (
    <ListItem disablePadding>
      <ListItemText>
        <Typography
          variant="body1"
          fontWeight={'bold'}
          whiteSpace={'pre-wrap'}
          textAlign={align}
          sx={{ color: 'text.secondary' }}
        >
          {entity}
        </Typography>
        <Typography variant="body2" textAlign={align}>
          {displayMessage}
        </Typography>
        {hasMore && (
          <Button
            variant="text"
            onClick={() => {
              setDisplayMessage(message);
            }}
          >
            Show more
          </Button>
        )}
      </ListItemText>
    </ListItem>
  );
};

export interface ChatHistoryProps {
  requests: AgentRequestTrace[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ requests }) => {
  return (
    <List disablePadding>
      {requests.map((request) => (
        <Box key={request.requestId}>
          <ChatItem
            entity={ChatEntity.User}
            message={request.requestInput.userMessage || ''}
            data={request.requestInput.payload}
          />
          <ChatItem
            entity={ChatEntity.Agent}
            message={request.responseOutput.message || ''}
            data={request.responseOutput.data}
          />
          {request.tracePreviewUrl && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                my: 2,
              }}
            >
              <Link href={request.tracePreviewUrl} target="_blank">
                View Full Trace
              </Link>
            </Box>
          )}
          <Divider />
        </Box>
      ))}
    </List>
  );
};

export default ChatHistory;
