import { useContext, useMemo } from "react";
import { ExperimentDataContext, ExperimentTestResult } from "./data.context";

export const useTestCase = (testCaseId: string) => {
  const { testCases, setTestCases, runTestCase } = useContext(ExperimentDataContext);
  const testCase = useMemo(
    () => testCases.find((tc) => tc.id === testCaseId),
    [testCases, testCaseId]
  );

  const handleChangeTestCaseLabel = (label: string) => {
    setTestCases((currentTestCases) =>
      currentTestCases.map((tc) =>
        tc.id === testCaseId ? { ...tc, label } : tc
      )
    );
  }

  const handleChangeTestCaseUserMessage = (userMessage: string) => {
    setTestCases((currentTestCases) =>
      currentTestCases.map((tc) =>
        tc.id === testCaseId ? { ...tc, userMessage } : tc
      )
    );
  }

  const handleChangeTestCaseContext = (contextJSON?: string) => {
    setTestCases((currentTestCases) =>
      currentTestCases.map((tc) =>
        tc.id === testCaseId ? { ...tc, contextJSON } : tc
      )
    );
  }

  const handleRemoveTestCase = () => {
    setTestCases((currentTestCases) =>
      currentTestCases.filter((tc) => tc.id !== testCaseId)
    );
  }

  return {
    testCase,
    handleChangeTestCaseLabel,
    handleChangeTestCaseUserMessage,
    handleChangeTestCaseContext,
    handleRemoveTestCase,
    runTests: () => {
      runTestCase(testCaseId);
    },
  };
};

export const useExperiment = (experimentId: string) => {
  const { experiments, setExperiments, runExperiment } = useContext(ExperimentDataContext);
  const experiment = useMemo(
    () => experiments.find((exp) => exp.id === experimentId),
    [experiments, experimentId]
  );

  const handleChangeExperimentLabel = (label: string) => {
    setExperiments((currentExperiments) =>
      currentExperiments.map((exp) =>
        exp.id === experimentId ? { ...exp, label } : exp
      )
    );
  }

  const handleChangeExperimentAgent = (agentId: string) => {
    setExperiments((currentExperiments) =>
      currentExperiments.map((exp) =>
        exp.id === experimentId ? { ...exp, agentId } : exp
      )
    );
  }

  const handleChangeExperimentFeatureFlag = (featureFlagJSON?: string) => {
    setExperiments((currentExperiments) =>
      currentExperiments.map((exp) =>
        exp.id === experimentId ? { ...exp, featureFlagJSON } : exp
      )
    );
  }

  const handleRemoveExperiment = () => {
    setExperiments((currentExperiments) =>
      currentExperiments.filter((exp) => exp.id !== experimentId)
    );
  }

  return {
    experiment,
    handleChangeExperimentLabel,
    handleChangeExperimentAgent,
    handleChangeExperimentFeatureFlag,
    handleRemoveExperiment,
    runTests: () => {
      runExperiment(experimentId);
    },
  };
}

export type UseTestResultReturn = {
  result?: ExperimentTestResult;
  runTest: () => void;
};

export const useExpTestResult = (
  experimentId: string,
  testCaseId: string
): UseTestResultReturn => {
  const { experimentTestResults, runExperimentTest } = useContext(
    ExperimentDataContext
  );
  return {
    result: experimentTestResults[experimentId]?.[testCaseId],
    runTest: () => {
      runExperimentTest(experimentId, testCaseId);
    },
  };
};
