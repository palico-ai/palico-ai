import {
  AgentRequestContent,
  AgentResponse,
} from '@palico-ai/common';

export type EvalMetricOutput = boolean | number | string;

export interface EvalMetric {
  evaluate: (
    input: AgentRequestContent,
    response: AgentResponse,
  ) => Promise<EvalMetricOutput>;
}

export type ExperimentTestResultMetricValue = Record<string, EvalMetricOutput>;

export interface ExperimentTestCaseResult {
  input: AgentRequestContent;
  output: AgentResponse;
  metrics: Record<string, EvalMetricOutput>;
}

export type ExperimentTestCaseTag = {
  category: string;
  value: string;
};

export interface ExperimentTestCaseDataset {
  agentInput: AgentRequestContent;
  tags: ExperimentTestCaseTag[];
  metrics: {
    label: string;
    metric: EvalMetric;
  }[];
}

export interface Dataset<Schema> {
  fetch: () => Promise<Schema[]>;
}