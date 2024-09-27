import React from 'react';
import ChatUI from './__components__/chatui';
import { ConversationContextProvider } from '../../../context/conversation';
import PageContent from '../../../components/layout/page_content';
import TopbarActions from './__components__/topbar_actions';
import { getAllAgents, getAllWorkflows } from '../../../services/metadata';
import Breadcrumb from '../../../utils/breadcrumb';
import {
  ConversationalEntity,
  ConversationalEntityType,
} from '../../../types/common';

const PlaygroundPage: React.FC = async () => {
  const agentMetadata = await getAllAgents();
  const workflows = await getAllWorkflows();
  const entities: ConversationalEntity[] = [
    ...agentMetadata.map((agent) => ({
      type: ConversationalEntityType.AGENT,
      name: agent.name,
    })),
    ...workflows.map((workflow) => ({
      type: ConversationalEntityType.WORKFLOW,
      name: workflow.name,
    })),
  ];

  return (
    <ConversationContextProvider conversationEntity={entities[0]}>
      <PageContent
        breadcrumb={[Breadcrumb.chat()]}
        actions={<TopbarActions conversationEntities={entities} />}
      >
        <ChatUI />
      </PageContent>
    </ConversationContextProvider>
  );
};

export default PlaygroundPage;
