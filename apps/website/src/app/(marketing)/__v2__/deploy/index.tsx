import React from 'react';
import SectionLayout from '../../__shared__/section_layout';
import { CodeSnippetTab, ContentWithMedia } from '../../__shared__/layouts';

const requestCodeSnippets = `const client = createClient({
  apiURL: <your-palico-app-url>,
  serviceKey: <service-key>,
});

// Agents
const response = await client.agent.newConversation({
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

// Workflows
const response = await client.workflows.newConversation({
  name: entity.name,
  // ...
});
`;

const chatCodeSnippets = `const response = await client.agent.replyAsUser({
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
      title="Deploy to Production | Integrate with API or SDK"
      alignTitle={'left'}
    >
      <ContentWithMedia
        centerContent
        descriptions={[
          'Deploy your application to any cloud as docker images',
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
