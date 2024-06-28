import React from 'react';
import { CodeSnippetTab, ContentWithMedia } from '../../__shared__/layouts';
import {
  agentCodeSnippets,
  workflowCodeSnippets,
} from '../../__shared__/constants/code_snippet';

const EDITOR_HEIGHT = 300;

const DefineYourApplication: React.FC = () => {
  return (
    <ContentWithMedia
      title={'Build an Experimentable LLM Application'}
      descriptions={[
        'We help you build a modular application layer. This allows you to rapidly test different components of your LLM stack and measure the impact on accuracy.',
        'Build simple LLM applications with Palico Agent or complex applications with Workflows',
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
          height={EDITOR_HEIGHT}
        />
      }
    />
  );
};

export default DefineYourApplication;
