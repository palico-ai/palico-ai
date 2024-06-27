import React from 'react';
import {
  CodeSnippetTab,
  HowItWorksStepWithMedia,
} from '../__components__/layouts';

const EDITOR_HEIGHT = 275;

const agentCodeSnippets = `class MathTutorLLMAgent implements Agent {
  async chat(
    content: ConversationRequestContent,
    context: ConversationContext
  ): Promise<AgentResponse> {
    const {
      model,
      promptStrategy,
      ragPipelineVersion,
    } = context.appConfig // build different variations of your agent

    const prompt = await MathTutorAgent.getPrompt(
      content.userMessage, // user message from the client
      content.payload, // additional data passed from the client
      promptStrategy,
      ragPipelineVersion
    );

    const response = await OpenAIService.newConversation({
      conversationId: context.conversationId,
      message: prompt,
      model,
    });

    return {
      message: response.message,
      data: {
        // ...any additional data you want to return to the client
      },
    };
  }
}
`;

const workflowCodeSnippets = `ChainWorkflow
  .create("Categorize Question", async (input, context) => {
  // ... call the categorization agent
  })
  .link("Identify Tutor Agent", async (input, context) => {
    // ... business logic to identify the tutor agent
  })
  .link("Call LLM Agent", async (input, context) => {
    // ... call the right LLM agent
  })
  .send(async (input, context) => {
    return {
      message: input.agent.message,
      data: input.agent.data,
    };
  });
`;

const DefineYourApplication: React.FC = () => {
  return (
    <HowItWorksStepWithMedia
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
