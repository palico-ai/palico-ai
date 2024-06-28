import React from 'react';
import { CodeSnippetTab, ContentWithMedia } from '../layouts';

const testCaseCodeSnippet = `[
  {
    input: {
      userMessage:
        'Given the equation 2x + 3 = 7, solve for x.',
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

interface BenchmarkAccuracySubSectionProps {
  centerContent?: boolean;
}

const BenchmarkAccuracySubSection: React.FC<
  BenchmarkAccuracySubSectionProps
> = ({ centerContent }) => {
  return (
    <ContentWithMedia
      title="Define your Accuracy Benchmarks"
      centerContent={centerContent}
      descriptions={[
        'Define test-cases that model the expected behaviors from your LLM Agent',
        'Measure accuracy with out-of-the-box metrics or define your own custom metrics',
      ]}
      media={
        <CodeSnippetTab
          tabs={[
            {
              label: 'Create a Benchmark',
              codeSnippet: testCaseCodeSnippet,
            },
            {
              label: 'Build Custom Metric',
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
