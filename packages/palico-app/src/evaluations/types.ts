import {
  AgentNewConversationRequestBody,
  AgentResponse,
} from '@palico-ai/common';

export type EvalMetricOutput = boolean | number | string;

export interface EvalMetric {
  evaluate: (
    input: AgentNewConversationRequestBody,
    response: AgentResponse,
  ) => Promise<EvalMetricOutput>;
}

export type ExperimentTestResultMetricValue = Record<string, EvalMetricOutput>;

export interface ExperimentTestCaseResult {
  input: AgentNewConversationRequestBody;
  output: AgentResponse;
  metrics: Record<string, EvalMetricOutput>;
}

export type ExperimentTestCaseTag = {
  category: string;
  value: string;
};

export interface ExperimentTestCaseDataset {
  agentInput: AgentNewConversationRequestBody;
  tags: ExperimentTestCaseTag[];
  metrics: {
    label: string;
    metric: EvalMetric;
  }[];
}

export interface Dataset<Schema> {
  fetch: () => Promise<Schema[]>;
}