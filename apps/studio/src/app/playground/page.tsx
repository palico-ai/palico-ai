import React from 'react';
import ChatUI from './__components__/chatui';
import { ConversationContextProvider } from '../../context/conversation';
import PageContent from '../../components/layout/page_content';
import { createClient } from '@palico-ai/client-js';
import TopbarActions from './__components__/topbar_actions';

const PlaygroundPage: React.FC = async () => {
  const agentAPIURL = 'http://localhost:8000';
  const serviceKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MTM4MDg3NzB9.GEskObwga-XXXvTM8V6v2d27RNb9-Y8em0Kim5Zazpg';

  const client = createClient({
    apiURL: agentAPIURL,
    serviceKey,
  });

  const agentMetadata = await client.metadata.getAgentsMetadata();
  console.log(agentMetadata);

  return (
    <ConversationContextProvider
      apiURL={agentAPIURL}
      agentId={agentMetadata[0].id}
      serviceKey={serviceKey}
    >
      <PageContent
        topbarRightNavs={
          <TopbarActions agentIds={agentMetadata.map((agent) => agent.id)} />
        }
      >
        <ChatUI />
      </PageContent>
    </ConversationContextProvider>
  );
};

export default PlaygroundPage;
