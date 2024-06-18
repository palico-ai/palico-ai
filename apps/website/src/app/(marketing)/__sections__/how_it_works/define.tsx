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
      title={'Build a modular system for experimentation'}
      descriptions={[
        'We help you build a modular application layer. This allows you to rapidly test different components of your LLM stack and measure the impact on accuracy.',
      ]}
      codeSnippet={codeSnippet}
    />
  );
};

export default DefineYourApplication;
