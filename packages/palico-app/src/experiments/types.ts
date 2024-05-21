import { ConversationRequestContent, AgentResponse } from '@palico-ai/common';
import { JobQueueState } from '../services/job_queue';

export type EvalMetricOutput = boolean | number | string;

export interface EvalMetric {
  label: string;

  evaluate: (
    input: ConversationRequestContent,
    response: AgentResponse
  ) => Promise<EvalMetricOutput>;
}

export type ExperimentTestResultMetricValue = Record<string, EvalMetricOutput>;

export interface ExperimentTestCaseResult {
  input: ConversationRequestContent;
  tags: ExperimentTestCaseTag;
  output: AgentResponse;
  metrics: Record<string, EvalMetricOutput>;
}

export type ExperimentTestCaseTag = Record<string, string>;
export interface ExperimentTestCaseDataset<Input = ConversationRequestContent> {
  input: Input;
  tags: ExperimentTestCaseTag;
  metrics: EvalMetric[];
}

export interface Dataset<Schema=unknown, FetchParams=unknown> {
  fetch: (params?: FetchParams) => Promise<Schema[]>;
}

export interface CreateExperimentParams {
  name: string;
}

export interface ExperimentMetadata {
  createdAt: string;
  directoryName: string;
  name: string;
}

export interface ExperimentTestJSON {
  job: {
    id?: string;
    status: JobQueueState;
    errorMessage?: string;
  };
  description?: string;
  featureFlags?: Record<string, unknown>;
  agentId: string;
  testCaseDatasetName: string;
  createdAt: number;
  result: ExperimentTestCaseResult[];
}

export interface ExperimentTest extends ExperimentTestJSON {
  experimentName: string;
  testName: string;
}

export interface CreateNewExperimentTestResult {
  jobId: string;
}
