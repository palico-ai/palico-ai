import React from 'react';
import ChatUI from './__components__/chatui';
import { ConversationContextProvider } from '../../context/conversation';
import PageContent from '../../components/layout/page_content';

const PlaygroundPage: React.FC = () => {
  const agentAPIURL = 'http://localhost:8000';
  const serviceKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MTM4MDg3NzB9.GEskObwga-XXXvTM8V6v2d27RNb9-Y8em0Kim5Zazpg';

  return (
    <PageContent>
      <ConversationContextProvider apiURL={agentAPIURL} serviceKey={serviceKey}>
        <ChatUI />
      </ConversationContextProvider>
    </PageContent>
  );
};

export default PlaygroundPage;
