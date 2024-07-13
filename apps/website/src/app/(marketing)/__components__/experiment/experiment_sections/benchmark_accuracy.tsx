import React from 'react';
import { CodeSnippetTab, ContentWithMedia } from '../../layouts';

const testCaseCodeSnippet = `[
  {
    input: { // input to the application
      userMessage:
        'Given the equation 2x + 3 = 7, solve for x.',
    },
    metrics: [ // measure response performance
      new SemanticSimilarity([
        "Answer: x = 2",
        "x = 2",
        "2",
      ]),
    ],
    tags: { // tags to categorize the test-case
      category: 'math',
    },
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

interface BenchmarkAccuracySubSectionProps {
  centerContent?: boolean;
}

const BenchmarkAccuracySubSection: React.FC<
  BenchmarkAccuracySubSectionProps
> = ({ centerContent }) => {
  return (
    <ContentWithMedia
      title="Define your Benchmark"
      centerContent={centerContent}
      descriptions={[
        'Model the expected behavior of your application by writing "unit-tests" for performance',
        'Measure the performance of a test-case by using metrics we provide, or by defining your own custom metrics',
      ]}
      media={
        <CodeSnippetTab
          tabs={[
            {
              label: 'Create a Test Suite',
              codeSnippet: testCaseCodeSnippet,
            },
            {
              label: 'Define Custom Metric',
              codeSnippet: customMetricCodeSnippet,
            },
          ]}
          height={300}
        />
      }
    />
  );
};

export default BenchmarkAccuracySubSection;
