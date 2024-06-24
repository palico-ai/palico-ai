export interface RequireLabId {
  labId: string;
}

export interface RequireLabName {
  labName: string;
}

export interface RequireExperimentName {
  experimentName: string;
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
