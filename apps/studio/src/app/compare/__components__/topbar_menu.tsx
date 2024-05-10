'use client';
import { Box, MenuItem, TextField } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { LabContext } from './lab.context';
import {
  LabExperimentModel,
  LabExperimentTestResult,
  LabTestCaseModel,
  StudioLabModelMetadata,
} from '@palico-ai/common';
import { updateLabView } from '../../../services/studio';
import { Button } from '@palico-ai/components';

export interface QuicklabTopbarNavProps {
  initialLabViews: StudioLabModelMetadata[];
  initialActiveViewId?: string;
}

type SavedState = {
  experiments: LabExperimentModel[];
  testCases: LabTestCaseModel[];
  experimentTestResults: Record<
    string,
    Record<string, LabExperimentTestResult>
  >;
};

const QuicklabTopbarNav: React.FC<QuicklabTopbarNavProps> = ({
  initialLabViews,
  initialActiveViewId,
}) => {
  const { experiments, testCases, experimentTestResults } =
    useContext(LabContext);
  const [savedState, setSavedState] = React.useState<SavedState>({
    experiments,
    testCases,
    experimentTestResults,
  });
  const [needsSave, setNeedsSave] = React.useState(false);
  const [activeViewId, setActiveViewId] = React.useState<string | undefined>(
    initialActiveViewId
  );
  const [savingInProgress, setSavingInProgress] = React.useState(false);

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
      if(!activeViewId) {
        // TODO: Prompt to create view name
        throw new Error('No active view selected');
      }
      setSavingInProgress(true);
      const newSaveState = {
        experiments,
        testCases,
        experimentTestResults,
      };
      await updateLabView(activeViewId, {
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
    <Box
      sx={{
        display: 'flex',
        gap: 2,
      }}
    >
      <Button
        variant="contained"
        color="info"
        disabled={!needsSave}
        onClick={handleSave}
        loading={savingInProgress}
      >
        Save
      </Button>
      <TextField
        sx={{
          minWidth: 200,
        }}
        size="small"
        value={activeViewId}
        onChange={(e) => setActiveViewId(e.target.value)}
        variant="outlined"
        select
        label="Select View"
      >
        {initialLabViews.map((view) => (
          <MenuItem key={view.id} value={view.id}>
            {view.name}
          </MenuItem>
        ))}
      </TextField>
      <Button variant="contained" color="secondary">
        Create New View
      </Button>
    </Box>
  );
};

export default QuicklabTopbarNav;
