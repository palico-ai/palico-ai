import React from 'react';
import SectionLayout from '../../__shared__/section_layout';
import { CodeSnippetTab, ContentWithMedia } from '../../__shared__/layouts';
import {
  agentCodeSnippets,
  workflowCodeSnippets,
} from '../../__shared__/constants/code_snippet';

const BuildModularApp: React.FC = () => {
  return (
    <SectionLayout
      title="Build Your LLM Applications and Workflows"
      alignTitle={'left'}
    >
      <ContentWithMedia
        centerContent
        descriptions={[
          'Build simple LLM applications or complex workflows with Palico Agent or Workflows',
          'Build a modular application layer to easily test different components of your LLM stack',
          'Use external tools and libraries like AI gateway, Vector Databases, LangChain, to build flexible and dynamic applications',
        ]}
        media={
          <CodeSnippetTab
            tabs={[
              {
                label: 'Agent',
                codeSnippet: agentCodeSnippets,
              },
              {
                label: 'Workflow',
                codeSnippet: workflowCodeSnippets,
              },
            ]}
            height={320}
          />
        }
      />
    </SectionLayout>
  );
};

export default BuildModularApp;
