import { ConversationRequestContent, ConversationResponse } from '.';

export interface CreateExperimentParams {
  name: string;
  tags?: string[];
}

export interface ExperimentMetadata extends ExperimentJSON {
  name: string;
}

export interface ExperimentJSON {
  tags: string[];
  createdAt: number;
}

export type EvalMetricOutput = number;

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

export interface Dataset<Schema = unknown, FetchParams = unknown> {
  fetch: (params?: FetchParams) => Promise<Schema[]>;
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
}

export interface TestResultJSON {
  result: ExperimentTestCaseResult[];
}

export interface ExperimentTest extends ExperimentTestJSON, TestResultJSON {
  experimentName: string;
  testName: string;
}

export type ExperimentTestMetadata = Omit<ExperimentTest, 'result'>;

export type CreateExperimentTestParams = Omit<
  ExperimentTest,
  'createdAt' | 'jobId' | 'result' | 'status'
>;

export interface CreateExperimentTestJobResponse {
  jobId: string;
  test: ExperimentTestMetadata;
}

export interface ExperimentTestKeyID {
  experimentName: string;
  testName: string;
}

export interface GetAllTestsResponse {
  tests: ExperimentTestKeyID[];
}
