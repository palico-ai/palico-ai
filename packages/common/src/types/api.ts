import { ConversationRequestTraceItem, ConversationTraces, ConversationTracesWithoutRequests } from "./telemetry";

export interface MetadataListItemCommon {
  name: string;
}

export interface GetAgentMetadataResponse {
  agents: MetadataListItemCommon[];
}

export interface GetWorkflowMetadataResponse {
  workflows: MetadataListItemCommon[];
}

export interface GetDatasetMetadataResponse {
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

export interface PaginationParams {
  limit: number;
  offset: number;
}