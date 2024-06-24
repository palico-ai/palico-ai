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

export type EvalMetricResultMap = Record<string, EvalMetricOutput>;

export interface EvalResult {
  input: ConversationRequestContent;
  tags: EvalTestCaseTag;
  output: ConversationResponse;
  metrics: EvalMetricResultMap;
}

export type EvalTestCaseTag = Record<string, string>;

export interface EvalTestCase<Input = ConversationRequestContent> {
  input: Input;
  tags: EvalTestCaseTag;
  metrics: EvalMetric[];
}

export enum EvalJobStatus {
  CREATED = 'created',
  ACTIVE = 'active',
  FAILED = 'failed',
  SUCCESS = 'success',
}

export interface EvalJSON {
  status: {
    state: EvalJobStatus;
    message?: string;
  };
  jobId?: string;
  description?: string;
  featureFlags?: Record<string, unknown>;
  agentName?: string;
  workflowName?: string;
  testSuiteName: string;
  createdAt: number;
}

export interface EvalResultJSON {
  result: EvalResult[];
}

export interface Evaluation extends EvalJSON, EvalResultJSON {
  experimentName: string;
  evalName: string;
}

export type EvaluationMetadata = Omit<Evaluation, 'result'>;

export type CreateEvaluationParams = Omit<
  Evaluation,
  'createdAt' | 'jobId' | 'result' | 'status'
>;

export interface CreateEvalJobResponse {
  jobId: string;
  evalName: EvaluationMetadata;
}

export interface EvalJobKeyID {
  experimentName: string;
  evalName: string;
}

export interface GetAllEvalsResponse {
  evals: EvalJobKeyID[];
}
