import React from 'react';
import HowItWorksStep from './side_by_side_layout';
import { LandingPageData } from '../../data';

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
      title={LandingPageData.howItWorks.step.defineYourAgent.title}
      descriptions={
        LandingPageData.howItWorks.step.defineYourAgent.descriptions
      }
      codeSnippet={codeSnippet}
    />
  );
};

export default DefineYourApplication;
