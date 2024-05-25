import React from 'react';
import ChatUI from './__components__/chatui';
import { ConversationContextProvider } from '../../context/conversation';
import PageContent from '../../components/layout/page_content';
import TopbarActions from './__components__/topbar_actions';
import { getAllAgents } from '../../services/metadata';

const PlaygroundPage: React.FC = async () => {

  const agentMetadata = await getAllAgents()
  console.log(agentMetadata);

  return (
    <ConversationContextProvider agentId={agentMetadata[0].name}>
      <PageContent
        topbarRightNavs={
          <TopbarActions agentIds={agentMetadata.map((agent) => agent.name)} />
        }
      >
        <ChatUI />
      </PageContent>
    </ConversationContextProvider>
  );
};

export default PlaygroundPage;
