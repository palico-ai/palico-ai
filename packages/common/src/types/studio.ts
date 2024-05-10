export interface LabExperimentModel {
  id: string;
  agentId: string;
  label: string;
  featureFlagJSON?: string;
}

export interface LabTestCaseModel {
  id: string;
  label: string;
  userMessage: string;
  contextJSON?: string;
}

export type LabExperimentTestResult = {
  status: 'RUNNING' | 'SUCCESS' | 'FAILURE';
  message?: string;
};

export interface StudioLabModel {
  id: string;
  name: string;
  experiments: LabExperimentModel[];
  testCases: LabTestCaseModel[];
  experimentTestResults: Record<
    string,
    Record<string, LabExperimentTestResult>
  >;
  createdAt: string;
  updatedAt: string;
}

export type StudioLabModelMetadata = Pick<StudioLabModel, 'id' | 'name'>;

export type CreateStudioLabParams = Omit<
  StudioLabModel,
  'id' | 'createdAt' | 'updatedAt'
>;

export type StudioLabUpdatableFields = Pick<StudioLabModel, 'name' | 'experiments' | 'testCases' | 'experimentTestResults'>;

export type UpdateStudioLabParams = Partial<StudioLabUpdatableFields>;