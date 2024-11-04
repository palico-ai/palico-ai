import React from 'react';
import ChatUI from './__components__/chatui';
import PageContent from '../../../components/layout/page_content';
import TopbarActions from './__components__/topbar_actions';
import { getAllAgents } from '../../../services/metadata';
import Breadcrumb from '../../../utils/breadcrumb';
import { redirect } from 'next/navigation';
import { RoutePath } from '../../../utils/route_path';

export interface Props {
  searchParams: {
    agentName?: string;
    noAgent?: boolean;
  };
}

const PlaygroundPage: React.FC<Props> = async ({
  searchParams: { agentName, noAgent },
}) => {
  const agents = await getAllAgents();
  if (!noAgent && !agentName) {
    if (agents.length === 0) {
      return redirect(RoutePath.chat({ noAgent: true }));
    }
    redirect(RoutePath.chat({ agentName: agents[0]?.name }));
  }

  return (
    <PageContent
      breadcrumb={[Breadcrumb.chat()]}
      actions={<TopbarActions agents={agents.map((agent) => agent.name)} />}
    >
      <ChatUI />
    </PageContent>
  );
};

export default PlaygroundPage;
