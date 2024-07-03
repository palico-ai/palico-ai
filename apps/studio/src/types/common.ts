import { PaginationParams } from '@palico-ai/common';

export interface RequireLabId {
  labId: string;
}

export interface RequireLabName {
  labName: string;
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

export enum ConversationalEntityType {
  AGENT = 'agent',
  WORKFLOW = 'workflow',
}

export interface ConversationalEntity {
  name: string;
  type: ConversationalEntityType;
}

export interface PaginatedResponse<T> {
  items: T[];
  nextPage?: PaginationParams;
}
