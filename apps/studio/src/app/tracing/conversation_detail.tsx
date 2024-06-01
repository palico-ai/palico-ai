'use client';

import { Editor } from '@monaco-editor/react';
import { Box } from '@mui/material';
import {
  ConversationRequestTraceItem,
  ConversationTraces,
} from '@palico-ai/common';
import {
  SyntaxHighlighter,
  List,
  ListItem,
  TabView,
  TabPanel,
} from '@palico-ai/components';
import ChatHistory from '../../components/chat/history';

interface ConversationDetailProps {
  conversation: ConversationTraces;
}

interface ConversationRequestItemProps {
  request: ConversationRequestTraceItem;
}

const ConversationRequestItem: React.FC<ConversationRequestItemProps> = ({
  request,
}) => {
  return (
    <SyntaxHighlighter language="json">
      {JSON.stringify(request, null, 2)}
    </SyntaxHighlighter>
  );
};

const ConversationDetail: React.FC<ConversationDetailProps> = ({
  conversation,
}) => {
  return (
    <TabView
      tabs={[
        {
          label: 'Chat History',
          value: 'chat',
        },
        {
          label: 'Raw Data',
          value: 'raw',
        },
      ]}
    >
      <TabPanel value="raw">
        <Editor
          options={{
            readOnly: true,
            minimap: { enabled: false },
            scrollbar: { vertical: 'hidden' },
          }}
          height="90vh"
          theme="vs-dark"
          defaultLanguage="json"
          value={JSON.stringify(conversation.requests, null, 2)}
        />
      </TabPanel>
      <TabPanel value="chat">
        <Box
          sx={{
            height: '100%',
            overflowY: 'auto',
            padding: 2,
          }}
        >
          <ChatHistory requests={conversation.requests} />
        </Box>
      </TabPanel>
    </TabView>
  );
};

export default ConversationDetail;
