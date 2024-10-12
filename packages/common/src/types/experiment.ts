import { AggregationFnOption, TableState } from '@tanstack/react-table';
import {
  AppConfig,
  ChatRequestContent,
  ConversationResponse,
  QueueJobStatus,
} from '.';

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
    input: ChatRequestContent,
    response: ConversationResponse
  ) => Promise<EvalMetricOutput>;
}

export type EvalMetricResultMap = Record<string, EvalMetricOutput>;

export interface EvalTestCaseResult {
  input: ChatRequestContent;
  tags: EvalTestCaseTag;
  output: ConversationResponse;
  metrics: EvalMetricResultMap;
}

export type EvalTestCaseTag = Record<string, string>;

export interface EvalTestCase<Input = ChatRequestContent> {
  input: Input;
  tags: EvalTestCaseTag;
  metrics: EvalMetric[];
}

export interface EvalJSON {
  status: {
    state: QueueJobStatus;
    message?: string;
  };
  jobId?: string;
  description?: string;
  appConfig?: AppConfig;
  agentName?: string;
  workflowName?: string;
  testSuiteName: string;
  createdAt: number;
}

export interface EvalResultJSON {
  result: EvalTestCaseResult[];
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

export interface EvalCompositeKey {
  experimentName: string;
  evalName: string;
}

export interface GetAllEvalsResponse {
  evals: EvalCompositeKey[];
}

export enum NotebookWidgetType {
  Empty = 'empty',
  Table = 'table',
  Text = 'text',
}

export interface EmptyNotebookWidget {
  type: NotebookWidgetType.Empty;
}

export interface EvalTestCaseWithDatasetLabel extends EvalTestCaseResult {
  label: string;
}

export type TableNotebookWidgetColumnAggregatorFNMap = Record<
  string,
  AggregationFnOption<EvalTestCaseWithDatasetLabel>
>;

export interface TableNotebookWidget {
  type: NotebookWidgetType.Table;
  data: {
    tableState: Partial<TableState>;
    columnAggregationFn: TableNotebookWidgetColumnAggregatorFNMap;
  };
}

export interface TextboxNotebookWidget {
  type: NotebookWidgetType.Text;
  data: {
    text: string;
  };
}

export type NotebookWidget =
  | EmptyNotebookWidget
  | TableNotebookWidget
  | TextboxNotebookWidget;

export interface DatasetMetadata extends EvalCompositeKey {
  label: string;
}

export interface NotebookCompositeKey {
  experimentName: string;
  notebookName: string;
}

export interface NotebookJSON extends NotebookMetadata {
  datasetMetadata: DatasetMetadata[];
  rows: NotebookWidget[];
}

export type UpdateNotebookJSONParams = Partial<
  Pick<NotebookJSON, 'rows' | 'datasetMetadata'>
>;

export type NotebookMetadata = NotebookCompositeKey;
