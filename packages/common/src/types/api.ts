import {
  AppConfig,
  ConversationRequestContent,
  ConversationResponse,
  CreateEvalJobResponse,
  CreateEvaluationParams,
  CreateExperimentParams,
  CreateQuickLabParams,
  EvalJobStatus,
  EvaluationMetadata,
  ExperimentMetadata,
  NotebookJSON,
  NotebookMetadata,
  QuickLab,
  QuickLabContentJSON,
  QuickLabMetadata,
} from '.';
import {
  ConversationRequestTraceItem,
  ConversationTraces,
  ConversationTracesWithoutRequests,
} from './telemetry';

export interface MetadataListItemCommon {
  name: string;
}

export interface GetAgentMetadataResponse {
  agents: MetadataListItemCommon[];
}

export interface GetWorkflowMetadataResponse {
  workflows: MetadataListItemCommon[];
}

export interface GetAllTestSuitesResponse {
  datasets: MetadataListItemCommon[];
}

export interface GetConversationRequestTraces {
  requests: ConversationRequestTraceItem[];
}

export interface GetTracesByConversationResponse {
  conversation: ConversationTraces;
}

export interface GetRecentConversationResponse {
  conversations: ConversationTracesWithoutRequests[];
}

export interface GetTraceForRequestIdResponse {
  request: ConversationRequestTraceItem;
}

// ======== Route: /agent ========
export interface AgentConversationAPIRequestBody {
  appConfig?: AppConfig;
  content: ConversationRequestContent;
}

export type AgentConversationAPIRequestResponse = ConversationResponse;

// ======== Route: /workflow ========

export interface WorkflowConverationAPIRequestBody {
  appConfig?: AppConfig;
  content: ConversationRequestContent;
}

export type WorkflowRequestAPIResponse = ConversationResponse;
// ======== Route: /experiments ========

export type CreateEvalAPIRequestBody = Omit<
  CreateEvaluationParams,
  'experimentName'
>;

export type CreateEvalAPIResponse = CreateEvalJobResponse;

export type NewExperimentAPIRequestBody = CreateExperimentParams;

export type NewExperimentAPIResponse = ExperimentMetadata;

export type GetAllExperimentsAPIResponse = {
  experiments: ExperimentMetadata[];
};

export type GetExperimentByNameAPIResponse = ExperimentMetadata;

export type GetAllEvalsAPIResponse = {
  evals: EvaluationMetadata[];
};

export type GetEvalStatusAPIResponse = {
  state: EvalJobStatus;
  message?: string;
};

// ======== Route: /experiments/:id/notebook ========
export type CreateNotebookAPIRequestBody = Omit<NotebookJSON, 'experimentName'>;
export type CreateNotebookAPIResponse = NotebookJSON;

export type GetNotebookAPIResponse = NotebookJSON;

export type UpdateNotebookAPIRequestBody = Partial<NotebookJSON>;
export type UpdateNotebookAPIResponse = MessageAPIResponse;

export type DeleteNotebookAPIResponse = MessageAPIResponse;

export type GetNotebooksForExperimentAPIResponse = {
  notebooks: NotebookMetadata[];
};

export type RemoveNotebookAPIResponse = MessageAPIResponse;

// ======== Route: /lab ========
export type CreateLabAPIRequestBody = CreateQuickLabParams;

export type CreateLabAPIResponse = QuickLab;

export type GetLabByIdAPIResponse = QuickLab;

export type UpdateLabAPIRequestBody = Partial<QuickLabContentJSON>;

export type UpdateLabAPIResponse = MessageAPIResponse;

export type DeleteLabAPIResponse = MessageAPIResponse;

export type GetLabListAPIResponse = {
  labs: QuickLabMetadata[];
};

// Common

export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface MessageAPIResponse {
  message: string;
}
