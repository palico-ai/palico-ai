import React from 'react';
import PageContent from '../../components/layout/page_content';
import { getRecentConversations } from '../../services/telemetry';
import ConversationLayout from './conversation_layout';

const LIMIT = 25;

const TracingPage: React.FC = async () => {
  const conversations = await getRecentConversations({
    limit: LIMIT,
    offset: 0,
  });
  return (
    <PageContent
      disablePadding
      breadcrumb={[
        {
          label: 'Tracing',
        },
      ]}
    >
      <ConversationLayout
        initialConversations={conversations}
        limit={LIMIT}
        offset={0}
      />
    </PageContent>
  );
};

export default TracingPage;
