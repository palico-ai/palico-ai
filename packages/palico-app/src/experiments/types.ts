import { ConversationRequestContent, ConversationResponse } from '@palico-ai/common';

export type EvalMetricOutput = boolean | number | string;

export interface EvalMetric {
  label: string;

  evaluate: (
    input: ConversationRequestContent,
    response: ConversationResponse
  ) => Promise<EvalMetricOutput>;
}

export type ExperimentTestResultMetricValue = Record<string, EvalMetricOutput>;

export interface ExperimentTestCaseResult {
  input: ConversationRequestContent;
  tags: ExperimentTestCaseTag;
  output: ConversationResponse;
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

export enum ExperimentTestStatus {
  CREATED = 'created',
  ACTIVE = 'active',
  FAILED = 'failed',
  SUCCESS = 'success',
}

export interface ExperimentTestJSON {
  status: {
    state: ExperimentTestStatus;
    message?: string;
  };
  jobId?: string;
  description?: string;
  featureFlags?: Record<string, unknown>;
  agentName?: string;
  workflowName?: string;
  testCaseDatasetName: string;
  createdAt: number;
  result: ExperimentTestCaseResult[];
}

export interface ExperimentTest extends ExperimentTestJSON {
  experimentName: string;
  testName: string;
}

export interface CreateTestConfigResult {
  filePath: string;
  test: ExperimentTest;
}

export interface CreateNewExperimentTestResult {
  jobId: string;
}

export type CreateExperimentTestParams = Omit<
  ExperimentTest,
  'createdAt' | 'filePath' | 'jobId' | 'result' | "status"
>;