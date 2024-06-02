'use client';
import React, { useContext, useEffect } from 'react';
import { LabContext } from './lab.context';
import {
  LabExperimentModel,
  LabExperimentTestResult,
  LabTestCaseModel,
  StudioLabModelMetadata,
} from '@palico-ai/common';
import { updateLabView } from '../../../../services/studio';
import { Button } from '@palico-ai/components';
import { useRouter } from 'next/navigation';

export interface QuicklabTopbarNavProps {
  currentLab: StudioLabModelMetadata;
}

type SavedState = {
  experiments: LabExperimentModel[];
  testCases: LabTestCaseModel[];
  baselineExperimentId?: string;
  experimentTestResults: Record<
    string,
    Record<string, LabExperimentTestResult>
  >;
};

const QuicklabTopbarNav: React.FC<QuicklabTopbarNavProps> = ({
  currentLab,
}) => {
  const {
    experiments,
    testCases,
    experimentTestResults,
    baselineExperimentId,
  } = useContext(LabContext);
  const [savedState, setSavedState] = React.useState<SavedState>({
    experiments,
    testCases,
    baselineExperimentId,
    experimentTestResults,
  });
  const [needsSave, setNeedsSave] = React.useState(false);
  const [savingInProgress, setSavingInProgress] = React.useState(false);
  const router = useRouter();

  useEffect(() => {
    const currentUnsavedState = {
      experiments,
      testCases,
      experimentTestResults,
    };
    if (
      !needsSave &&
      JSON.stringify(currentUnsavedState) !== JSON.stringify(savedState)
    ) {
      setNeedsSave(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experiments, testCases, experimentTestResults]);

  const handleSave = async () => {
    try {
      setSavingInProgress(true);
      const newSaveState = {
        experiments,
        testCases,
        experimentTestResults,
      };
      await updateLabView(currentLab.id, {
        experiments: newSaveState.experiments,
        testCases: newSaveState.testCases,
        experimentTestResults: newSaveState.experimentTestResults,
      });
      setNeedsSave(false);
      setSavedState({
        experiments,
        testCases,
        experimentTestResults,
      });
      setSavingInProgress(false);
    } catch (e) {
      console.log(e);
      setSavingInProgress(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="info"
        disabled={!needsSave}
        onClick={handleSave}
        loading={savingInProgress}
      >
        Save
      </Button>
      <Button
        onClick={() => {
          router.push('/labs');
        }}
      >
        Close
      </Button>
    </>
  );
};

export default QuicklabTopbarNav;
