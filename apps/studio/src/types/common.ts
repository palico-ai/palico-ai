import { PaginationParams } from '@palico-ai/common';

export interface RequireLabId {
  labId: string;
}

export interface RequireLabName {
  labName: string;
}

export interface RequireAgentName {
  agentName: string;
}

export interface RequireExperimentName {
  experimentName: string;
}

export interface RequireNoteobokName {
  notebookName: string;
}

export interface RequireEvalName {
  evalName: string;
}

export interface RequireTestReportName {
  testReportName: string;
}

export interface ConversationalEntity {
  name: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  nextPage?: PaginationParams;
}
