'use client';

import {
  LabExperimentTestResult,
  LabExperimentModel,
  LabTestCaseModel,
} from '@palico-ai/common';
import React from 'react';
import { newConversation } from '../../../../../services/agent';

export type AddExperimentParams = Omit<LabExperimentModel, 'id'>;
export type AddTestCaseParams = Omit<LabTestCaseModel, 'id'>;

export interface LabCanvasContextParams {
  baselineExperimentId?: string;
  agentIdList: string[];
  experiments: LabExperimentModel[];
  setExperiments: React.Dispatch<React.SetStateAction<LabExperimentModel[]>>;
  testCases: LabTestCaseModel[];
  setTestCases: React.Dispatch<React.SetStateAction<LabTestCaseModel[]>>;
  experimentTestResults: Record<
    string,
    Record<string, LabExperimentTestResult>
  >; // experimentId -> testCaseId -> result
  setBaselineExperimentId: (experimentId?: string) => void;
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

/**
 * Tracks Lab State
 * Does not automatically presist state
 */
export const LabCanvasContext = React.createContext<LabCanvasContextParams>({
  baselineExperimentId: undefined,
  agentIdList: [],
  experiments: [],
  testCases: [],
  experimentTestResults: {},
  setBaselineExperimentId: NotImplementedFN,
  setExperiments: NotImplementedFN,
  setTestCases: NotImplementedFN,
  addExperiment: NotImplementedFN,
  addTestCase: NotImplementedFN,
  runExperimentTest: NotImplementedFN,
  runAllExperiments: NotImplementedFN,
  runTestCase: NotImplementedFN,
  runExperiment: NotImplementedFN,
});

export type LabContextProviderProps = {
  agentIdList: string[];
  initialExperiments: LabExperimentModel[];
  initialTestCases: LabTestCaseModel[];
  initialExperimentTestResults: Record<
    string,
    Record<string, LabExperimentTestResult>
  >;
  initialBaselinedExperimentId?: string;
  children: React.ReactNode;
};

export const LabCanvasContextProvider: React.FC<LabContextProviderProps> = ({
  children,
  agentIdList,
  initialExperiments,
  initialTestCases,
  initialBaselinedExperimentId,
  initialExperimentTestResults,
}) => {
  const [experiments, setExperiments] =
    React.useState<LabExperimentModel[]>(initialExperiments);
  const [testCases, setTestCases] =
    React.useState<LabTestCaseModel[]>(initialTestCases);
  const [experimentTestResults, setExperimentTestResults] = React.useState<
    Record<string, Record<string, LabExperimentTestResult>>
  >(initialExperimentTestResults);
  const [baselineExperimentId, setBaselineExperimentId] = React.useState<
    string | undefined
  >(initialBaselinedExperimentId);

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
      console.log('Running test case', testCase, 'for experiment', experiment);
      const response = await newConversation({
        agentName: experiment.agentId,
        appConfig: experiment.appConfigJSON
          ? JSON.parse(experiment.appConfigJSON)
          : undefined,
        userMessage: testCase.userMessage,
        payload: testCase.payloadString
          ? JSON.parse(testCase.payloadString)
          : undefined,
      });
      setExperimentTestResults((currentResult) => ({
        ...currentResult,
        [experimentId]: {
          ...currentResult[experimentId],
          [testCaseId]: {
            status: 'SUCCESS',
            message: response.message ?? 'No message',
            data: response.data,
            metadata: {
              conversationId: response.conversationId,
              requestId: response.requestId,
            },
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
    const id = crypto.randomUUID();
    setExperiments([
      {
        id,
        ...experiment,
      },
      ...experiments,
    ]);
    if (!baselineExperimentId) setBaselineExperimentId(id);
  };

  const addTestCase = (testCase: Omit<LabTestCaseModel, 'id'>) => {
    const id = crypto.randomUUID();
    setTestCases([
      {
        id,
        ...testCase,
      },
      ...testCases,
    ]);
  };

  return (
    <LabCanvasContext.Provider
      value={{
        baselineExperimentId,
        setBaselineExperimentId,
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
    </LabCanvasContext.Provider>
  );
};
