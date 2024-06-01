import { ConversationRequestContent, ConversationResponse } from ".";

export interface CreateExperimentParams {
  name: string;
}

export interface ExperimentMetadata {
  createdAt: string;
  directoryName: string;
  name: string;
}

export type EvalMetricOutput = boolean | number | string | undefined;

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
  result: ExperimentTestCaseResult[];
}

export interface ExperimentTest extends ExperimentTestJSON {
  experimentName: string;
  testName: string;
}

export type ExperimentTestMetadata = Omit<ExperimentTest, 'result'>;

export type CreateExperimentTestParams = Omit<
  ExperimentTest,
  'createdAt' | 'filePath' | 'jobId' | 'result' | 'status'
>;

export interface CreateExperimentTestJobResponse {
  jobId: string;
  test: ExperimentTest;
}

export interface TestNameWithExperiment {
  experimentName: string;
  testName: string;
}

export interface GetAllTestsResponse {
  tests: TestNameWithExperiment[];
}