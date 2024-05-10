import React from 'react';
import ChatUI from './__components__/chatui';
import { ConversationContextProvider } from '../../context/conversation';
import PageContent from '../../components/layout/page_content';
import TopbarActions from './__components__/topbar_actions';
import { getPalicoClient } from '../../services/palico';

const PlaygroundPage: React.FC = async () => {
  const client = await getPalicoClient();

  const agentMetadata = await client.metadata.getAgentsMetadata();
  console.log(agentMetadata);

  return (
    <ConversationContextProvider agentId={agentMetadata[0].id}>
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
