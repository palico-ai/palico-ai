import React from 'react';
import {
  CodeSnippetTab,
  HowItWorksStepWithMedia,
} from '../__components__/layouts';

const testCaseCodeSnippet = `[
  {
    input: {
      userMessage:
        'Given the equation 2x + 3 = 7, solve for x. Only respond with the final value of x.',
    },
    tags: {
      category: 'math',
    },
    metrics: [
      new SemanticSimilarity([
        "Answer: x = 2",
        "x = 2",
        "2",
      ]),
    ],
  },
  {
    input: {
      userMessage: 'What is the capital of France?',
    },
    tags: {
      category: 'history',
    },
    metrics: [
      new ContainsMetric({
        substring: 'Paris',
      }),
    ],
  },
  ...
]`;

const customMetricCodeSnippet = `class ResponseLengthEvalMetric implements EvalMetric {
  label = "response_length";

  constructor(private readonly maxResponseLength: number) {}

  async evaluate(
    input: ConversationRequestContent<Record<string, unknown>>,
    response: ConversationResponse
  ): Promise<EvalMetricOutput> {
    if (!response.message) {
      return 1;
    }
    return response.message?.length <= this.maxResponseLength ? 1 : 0;
  }
}
`;

const UnitestAccuracySection: React.FC = () => {
  return (
    <HowItWorksStepWithMedia
      title="Define your Accuracy Benchmarks"
      descriptions={[
        'Define test-cases that model the expected behaviors from your LLM Agent',
        'Measure accuracy with out-of-the-box metrics or define your own custom metrics',
      ]}
      media={
        <CodeSnippetTab
          tabs={[
            {
              label: 'Test Cases',
              codeSnippet: testCaseCodeSnippet,
            },
            {
              label: 'Custom Metrics',
              codeSnippet: customMetricCodeSnippet,
            },
          ]}
          height={250}
        />
      }
    />
  );
};

export default UnitestAccuracySection;
