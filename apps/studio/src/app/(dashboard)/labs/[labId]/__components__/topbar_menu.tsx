'use client';
import React, { useContext, useEffect } from 'react';
import { LabCanvasContext } from './canvas.context';
import {
  LabExperimentModel,
  LabExperimentTestResult,
  LabTestCaseModel,
  QuickLabContentJSON,
  QuickLabMetadata,
} from '@palico-ai/common';
import { updateLabView } from '../../../../../services/studio';
import { Button } from '@palico-ai/components';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { GET_QUICK_LAB } from '../../../../../constants/query_keys';

export interface QuicklabTopbarNavProps {
  currentLab: QuickLabMetadata;
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
  } = useContext(LabCanvasContext);
  const queryClient = useQueryClient();
  const [savedState, setSavedState] = React.useState<SavedState>({
    experiments,
    testCases,
    baselineExperimentId,
    experimentTestResults,
  });
  const [needsSave, setNeedsSave] = React.useState(false);
  const [savingInProgress, setSavingInProgress] = React.useState(false);
  const router = useRouter();

  const currentLabState: QuickLabContentJSON = {
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
      console.log(`lab id: ${currentLab.id} saved`);
      await queryClient.invalidateQueries({
        queryKey: [GET_QUICK_LAB, currentLab.id],
      });
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
