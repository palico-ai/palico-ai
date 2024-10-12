import {
  AppConfig,
  ChatRequestContent,
  ConversationResponse,
  CreateEvalJobResponse,
  CreateEvaluationParams,
  CreateExperimentParams,
  CreateQuickLabParams,
  QueueJobStatus,
  EvaluationMetadata,
  ExperimentMetadata,
  InputWithAppConfig,
  JSONAbleObject,
  NotebookJSON,
  NotebookMetadata,
  QuickLab,
  QuickLabContentJSON,
  QuickLabMetadata,
  RequestTemplate,
  WorkflowGraphSerialized,
  WorkflowResponse,
} from '.';
import {
  RequestLogs,
  ConversationRequestSpan,
  ConversationRequestItem,
  ConversationTraceWithRequests,
  ConversationTraceWithoutRequests,
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

export interface GetRecentRequestTelemetryResponse {
  requests: ConversationRequestItem[];
}

export interface GetConversationTelemetryResponse {
  conversation: ConversationTraceWithRequests;
}

export interface GetRecentConversationResponse {
  conversations: ConversationTraceWithoutRequests[];
}

export interface GetTelemetryForRequestIdResponse {
  request: ConversationRequestItem;
}

export interface GetRequestSpanResponse {
  spans: ConversationRequestSpan[];
}

export interface GetRequestLogsResponse {
  logs: RequestLogs;
}

// ======== Route: /agent ========
export interface AgentConversationAPIRequestBody {
  appConfig?: AppConfig;
  content: ChatRequestContent;
}

export type AgentConversationAPIRequestResponse = ConversationResponse;

// ======== Route: /workflow ========

export interface WorkflowNewConverationRequestBody {
  appConfig?: AppConfig;
  input: JSONAbleObject;
}

export type WorkflowRequestAPIResponse = {
  requestId: string;
};

export interface GetWorkflowBynameAPIResponse {
  name: string;
  graph: WorkflowGraphSerialized;
  templates: RequestTemplate<InputWithAppConfig>[];
}

export interface GetRecentWorkflowRequestsResponse {
  requests: ConversationRequestItem[];
}

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
  state: QueueJobStatus;
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
