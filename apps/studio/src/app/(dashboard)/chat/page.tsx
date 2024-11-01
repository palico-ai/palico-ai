import React from 'react';
import ChatUI from './__components__/chatui';
import { ConversationContextProvider } from '../../../context/conversation';
import PageContent from '../../../components/layout/page_content';
import TopbarActions from './__components__/topbar_actions';
import { getAllAgents } from '../../../services/metadata';
import Breadcrumb from '../../../utils/breadcrumb';

const PlaygroundPage: React.FC = async () => {
  const agents = await getAllAgents();

  return (
    <ConversationContextProvider agentName={agents[0]?.name}>
      <PageContent
        breadcrumb={[Breadcrumb.chat()]}
        actions={<TopbarActions agents={agents.map((item) => item.name)} />}
      >
        <ChatUI />
      </PageContent>
    </ConversationContextProvider>
  );
};

export default PlaygroundPage;
