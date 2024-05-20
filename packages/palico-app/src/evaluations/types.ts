import { AgentRequestContent, AgentResponse } from '@palico-ai/common';

export type EvalMetricOutput = boolean | number | string;

export interface EvalMetric {
  label: string;

  evaluate: (
    input: AgentRequestContent,
    response: AgentResponse
  ) => Promise<EvalMetricOutput>;
}

export type ExperimentTestResultMetricValue = Record<string, EvalMetricOutput>;

export interface ExperimentTestCaseResult {
  input: AgentRequestContent;
  tags: ExperimentTestCaseTag;
  output: AgentResponse;
  metrics: Record<string, EvalMetricOutput>;
}

export type ExperimentTestCaseTag = Record<string, string>;
export interface ExperimentTestCaseDataset<Input = AgentRequestContent> {
  input: Input;
  tags: ExperimentTestCaseTag;
  metrics: EvalMetric[];
}
