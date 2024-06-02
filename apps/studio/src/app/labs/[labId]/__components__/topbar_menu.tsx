'use client';
import React, { useContext, useEffect } from 'react';
import { LabContext } from './lab.context';
import {
  LabExperimentModel,
  LabExperimentTestResult,
  LabTestCaseModel,
  StudioLabModelMetadata,
  StudioLabUpdatableFields,
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

  const currentLabState: StudioLabUpdatableFields = {
    experiments,
    testCases,
    experimentTestResults,
    baselineExperimentId,
  };

  useEffect(() => {
    if (
      !needsSave &&
      JSON.stringify(currentLabState) !== JSON.stringify(savedState)
    ) {
      setNeedsSave(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLabState]);

  const handleSave = async () => {
    try {
      setSavingInProgress(true);
      await updateLabView(currentLab.id, currentLabState);
      setNeedsSave(false);
      setSavedState(currentLabState);
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
