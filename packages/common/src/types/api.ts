import {
  AgentRequestContent,
  AgentResponse,
  CreateEvalJobResponse,
  CreateEvaluationParams,
  CreateExperimentParams,
  CreateQuickLabParams,
  JobQueueStatus,
  EvaluationMetadata,
  ExperimentMetadata,
  NotebookJSON,
  NotebookMetadata,
  QuickLab,
  QuickLabContentJSON,
  QuickLabMetadata,
  JSONAbleObject,
} from '.';
import {
  RequestLogs,
  RequestSpan,
  AgentRequestTrace,
  AgentConversationTraceWithRequest,
  ConversationTracesWithoutRequests,
} from './telemetry';

export type HealthCheckResponse = {
  status: 'ok';
};

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
  requests: AgentRequestTrace[];
}

export interface GetConversationTelemetryResponse {
  conversation: AgentConversationTraceWithRequest;
}

export interface GetRecentConversationResponse {
  conversations: ConversationTracesWithoutRequests[];
}

export interface GetTelemetryForRequestIdResponse {
  request: AgentRequestTrace;
}

export interface GetRequestSpanResponse {
  spans: RequestSpan[];
}

export interface GetRequestLogsResponse {
  logs: RequestLogs;
}

// ======== Route: /agent ========
export interface AgentConversationAPIRequestBody {
  appConfig?: JSONAbleObject;
  content: AgentRequestContent;
  stream?: boolean;
}

export type AgentConversationAPIRequestResponse = AgentResponse;

// ======== Route: /workflow ========

export interface WorkflowConverationAPIRequestBody {
  appConfig?: JSONAbleObject;
  content: AgentRequestContent;
}

export type WorkflowRequestAPIResponse = AgentResponse;
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
  state: JobQueueStatus;
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
