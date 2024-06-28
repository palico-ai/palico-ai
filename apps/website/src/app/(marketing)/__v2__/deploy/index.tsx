import React from 'react';
import SectionLayout from '../../__shared__/section_layout';
import { CodeSnippetTab, ContentWithMedia } from '../../__shared__/layouts';

const requestCodeSnippets = `const client = createClient({
  apiURL: <agent-api-url>,
  serviceKey: <service-key>,
});

await client.agent.newConversation({
  name: entity.name,
  userMessage: '...',
  payload: {
    // ... any additional data you want to pass to your workflow
  },
  appConfig: {
    feature1: '...',
    feature2: '...',
  },
});

await client.workflows.newConversation({
  name: entity.name,
  // ...
});
`;

const chatCodeSnippets = `await client.workflows.replyAsUser({
  name: entity.name,
  userMessage: '...',
  conversationId: '...',
  payload: {
    // ... any additional data you want to pass to your workflow
  },
  appConfig: {
    feature1: '...',
    feature2: '...',
  },
});
`;

const DeployAndIntegrate: React.FC = () => {
  return (
    <SectionLayout
      title="Deploy to Production | Integrate with REST API or SDK"
      alignTitle={'left'}
    >
      <ContentWithMedia
        centerContent
        descriptions={[
          'Deploy your application anywhere with as docker containers',
          'Connect to your LLM application via REST API, or Palico Client SDK',
        ]}
        media={
          <CodeSnippetTab
            tabs={[
              {
                label: 'New Request',
                codeSnippet: requestCodeSnippets,
              },
              {
                label: 'Conversational Chat',
                codeSnippet: chatCodeSnippets,
              },
            ]}
            height={320}
          />
        }
      />
    </SectionLayout>
  );
};

export default DeployAndIntegrate;
