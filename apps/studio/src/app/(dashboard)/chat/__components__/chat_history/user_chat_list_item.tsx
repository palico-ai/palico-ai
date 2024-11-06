import { Box } from '@mui/material';
import { Accordion, Markdown, SyntaxHighlighter } from '@palico-ai/components';
import { ToolCallWithResult, UserMessage } from '@palico-ai/react';
import { ChatListItemDataDisplay } from './shared';

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

type UserChatListItemProps = UserMessage;

const UserChatListItem: React.FC<UserChatListItemProps> = ({
  message,
  toolCallResults,
  data,
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      {message && <Markdown>{message}</Markdown>}
      {toolCallResults && (
        <ChatListItemDataDisplay title="Tool Calls">
          <ToolCallResultContent toolCalls={toolCallResults} />
        </ChatListItemDataDisplay>
      )}
      {data && (
        <ChatListItemDataDisplay title="Data">
          <SyntaxHighlighter language="json">
            {JSON.stringify(data, null, 2)}
          </SyntaxHighlighter>
        </ChatListItemDataDisplay>
      )}
    </Box>
  );
};

export default UserChatListItem;
