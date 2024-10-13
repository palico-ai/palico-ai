import { AgentRequestContent, AgentResponse } from '.';

export interface LabExperimentModel {
  id: string;
  agentId: string;
  label: string;
  appConfigJSON?: string;
}

export interface LabTestCaseModel {
  id: string;
  label: string;
  userMessage: AgentRequestContent['userMessage'];
  payloadString?: string;
}

export interface LabExperimentTestResultMetadata {
  conversationId: string;
  requestId: string;
  tracePreviewUrl?: string;
}

export type LabExperimentTestResult = {
  status: 'RUNNING' | 'SUCCESS' | 'FAILURE';
  metadata?: LabExperimentTestResultMetadata;
  message?: AgentResponse['message'];
  data?: AgentResponse['data'];
};

export interface QuickLabContentJSON {
  experiments: LabExperimentModel[];
  testCases: LabTestCaseModel[];
  baselineExperimentId?: string;
  experimentTestResults: Record<
    string,
    Record<string, LabExperimentTestResult>
  >;
}

export interface QuickLabMetadata {
  id: string;
  name: string;
  createdAt: number;
}

export interface QuickLab extends QuickLabMetadata, QuickLabContentJSON {}

export type CreateQuickLabParams = Omit<
  QuickLab,
  'id' | 'createdAt' | 'updatedAt'
>;

export type UpdateStudioLabParams = Partial<QuickLabContentJSON>;
