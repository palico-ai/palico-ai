import React from 'react';
import HowItWorksStepWithMedia from './side_by_side_layout';

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
    <HowItWorksStepWithMedia
      maxHeight={400}
      title={'Build a modular LLM Application'}
      descriptions={[
        'To streamline your experimentation process, you need a modular application layer. Palico structures your LLM Development to build modular application by using feature-flags, and provides you with maximum flexibilities in what components you for building your application.',
      ]}
      codeSnippet={codeSnippet}
    />
  );
};

export default DefineYourApplication;
