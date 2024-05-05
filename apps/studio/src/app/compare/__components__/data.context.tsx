'use client';

import { usePalicoClient } from '../../../hooks/use_palico_client';
import React from 'react';
import { uuid } from 'uuidv4';
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

export type ExperimentTestResult = {
  status: 'RUNNING' | 'SUCCESS' | 'FAILURE';
  message?: string;
};

export type AddExperimentParams = Omit<LabExperimentModel, 'id'>;
export type AddTestCaseParams = Omit<LabTestCaseModel, 'id'>;

export interface ExperimentDataContextParams {
  viewId: string;
  viewLabel: string;
  agentIdList: string[];
  experiments: LabExperimentModel[];
  setExperiments: React.Dispatch<React.SetStateAction<LabExperimentModel[]>>;
  testCases: LabTestCaseModel[];
  setTestCases: React.Dispatch<React.SetStateAction<LabTestCaseModel[]>>;
  experimentTestResults: Record<string, Record<string, ExperimentTestResult>>; // experimentId -> testCaseId -> result
  addExperiment: (experiment: AddExperimentParams) => void;
  addTestCase: (testCase: AddTestCaseParams) => void;
  runExperimentTest: (experimentId: string, testCaseId: string) => void;
  runAllExperiments: () => void;
  runTestCase: (testCaseId: string) => void;
  runExperiment: (experimentId: string) => void;
}

const NotImplementedFN = () => {
  throw new Error('Not implemented');
};

export const ExperimentDataContext =
  React.createContext<ExperimentDataContextParams>({
    viewId: '',
    viewLabel: '',
    agentIdList: [],
    experiments: [],
    testCases: [],
    experimentTestResults: {},
    setExperiments: NotImplementedFN,
    setTestCases: NotImplementedFN,
    addExperiment: NotImplementedFN,
    addTestCase: NotImplementedFN,
    runExperimentTest: NotImplementedFN,
    runAllExperiments: NotImplementedFN,
    runTestCase: NotImplementedFN,
    runExperiment: NotImplementedFN,
  });

export type ExperimentDataContextProviderProps = {
  viewId: string;
  viewLabel: string;
  agentIdList: string[];
  initialExperiments: LabExperimentModel[];
  initialTestCases: LabTestCaseModel[];
  initialExperimentTestResults: Record<
    string,
    Record<string, ExperimentTestResult>
  >;
  children: React.ReactNode;
};

export const ExperimentDataContextProvider: React.FC<
  ExperimentDataContextProviderProps
> = ({
  children,
  viewId,
  agentIdList,
  viewLabel,
  initialExperiments,
  initialTestCases,
  initialExperimentTestResults,
}) => {
  const [experiments, setExperiments] =
    React.useState<LabExperimentModel[]>(initialExperiments);
  const [testCases, setTestCases] =
    React.useState<LabTestCaseModel[]>(initialTestCases);
  const [experimentTestResults, setExperimentTestResults] = React.useState<
    Record<string, Record<string, ExperimentTestResult>>
  >(initialExperimentTestResults);
  const client = usePalicoClient();

  // Runs a single test case for a single experiment
  const runExperimentTest = async (
    experimentId: string,
    testCaseId: string
  ) => {
    const testCase = testCases.find((tc) => tc.id === testCaseId);
    const experiment = experiments.find((exp) => exp.id === experimentId);
    try {
      setExperimentTestResults((currentResult) => ({
        ...currentResult,
        [experimentId]: {
          ...currentResult[experimentId],
          [testCaseId]: {
            status: 'RUNNING',
          },
        },
      }));
      if (!testCase) {
        throw new Error('Test case not found');
      }
      if (!experiment) {
        throw new Error('Experiment not found');
      }
      const response = await client.agents.newConversation({
        agentId: experiment.agentId,
        userMessage: testCase.userMessage,
        payload: JSON.parse(testCase.contextJSON || '{}'),
      });
      setExperimentTestResults((currentResult) => ({
        ...currentResult,
        [experimentId]: {
          ...currentResult[experimentId],
          [testCaseId]: {
            status: 'SUCCESS',
            message: response.message ?? 'No message',
          },
        },
      }));
    } catch (error) {
      setExperimentTestResults((currentResult) => ({
        ...currentResult,
        [experimentId]: {
          ...currentResult[experimentId],
          [testCaseId]: {
            status: 'FAILURE',
            message: error instanceof Error ? error.message : 'Unknown error',
          },
        },
      }));
    }
  };

  // Runs all test cases across all experiments
  const runAllExperiments = () => {
    experiments.forEach((experiment) => {
      testCases.forEach((testCase) => {
        runExperimentTest(experiment.id, testCase.id);
      });
    });
  };

  // Runs all experiments for a single test case
  const runTestCase = (testCaseId: string) => {
    experiments.forEach((experiment) => {
      runExperimentTest(experiment.id, testCaseId);
    });
  };

  // Runs all test cases for a single experiment
  const runExperiment = (experimentId: string) => {
    testCases.forEach((testCase) => {
      runExperimentTest(experimentId, testCase.id);
    });
  };

  const addExperiment = (experiment: Omit<LabExperimentModel, 'id'>) => {
    const id = uuid();
    setExperiments([
      {
        id,
        ...experiment,
      },
      ...experiments,
    ]);
  };

  const addTestCase = (testCase: Omit<LabTestCaseModel, 'id'>) => {
    const id = uuid();
    setTestCases([
      {
        id,
        ...testCase,
      },
      ...testCases,
    ]);
  };

  return (
    <ExperimentDataContext.Provider
      value={{
        viewId,
        viewLabel,
        agentIdList,
        experiments,
        setExperiments,
        setTestCases,
        testCases,
        experimentTestResults,
        addExperiment,
        addTestCase,
        runExperimentTest,
        runAllExperiments,
        runTestCase,
        runExperiment,
      }}
    >
      {children}
    </ExperimentDataContext.Provider>
  );
};
