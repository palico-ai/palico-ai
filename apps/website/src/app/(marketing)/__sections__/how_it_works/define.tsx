import React from 'react';
import HowItWorksStep from './side_by_side_layout';

const codeSnippet = `class IntentClassifier implements LLMAgent {
  async chat(
    content: ConversationRequestContent, 
    context: ConversationContext
  ) {
    const {
      featureFlags: { // example of feature flags
        model,
        useChainOfThought, 
        use10Shot,
        use20Shot,
      },
    } = context;
    const prompt = await createPrompt(content, {
      useChainOfThought,
      use10Shot,
      use20Shot,
    });
    switch(model) {
      case 'gpt4':
        return await gpt4Chat(prompt);
      case "llama":
        return await llamaChat(prompt);
      default:
        return await gpt35Chat(prompt);
    }
  }
}
`;

const DefineYourApplication: React.FC = () => {
  return (
    <HowItWorksStep
      maxHeight={400}
      title="Define your LLM Agent"
      descriptions={[
        'Define your LLM application with feature-flags to be able to test different how your LLM Agent performs under different models, prompts, business logics, and other variations',
        'Automatically deploy your Agent behind a REST API endpoint, and use our Javascript SDK to integrate it into your existing application',
      ]}
      codeSnippet={codeSnippet}
    />
  );
};

export default DefineYourApplication;
