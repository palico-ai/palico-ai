import React from 'react';
import SectionLayout from '../section_layout';
import { ContentWithMedia, CodeSnippetTab } from '../layouts';

const requestCodeSnippets = `import { createClient } from '@palico-ai/client-js';

const client = createClient({
  apiURL: <your-palico-app-url>,
  serviceKey: <service-key>,
});

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
      title="Deploy and Integrate with REST API or SDK"
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
                label: 'Call your Application',
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
