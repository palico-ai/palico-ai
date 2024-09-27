'use client';

import { Box } from '@mui/material';
import { Button } from '@palico-ai/components';
import React, { useContext, useMemo, useState } from 'react';
import NotebookContext from '../notebook.context';
import { updateNotebook } from '../../../../../../../../services/experiments';
import {
  useExperimentName,
  useNotebookName,
} from '../../../../../../../../hooks/use_params';
import { toast } from 'react-toastify';
import { NotebookWidget } from '@palico-ai/common';
import { Dataset } from '../types';

const serializeSavedState = (rows: NotebookWidget[], datasets: Dataset[]) =>
  JSON.stringify({
    rows,
    datasets: datasets.map((d) => ({
      experimentName: d.experimentName,
      evalName: d.evalName,
      label: d.label,
    })),
  });

const ExperimentReportPageAction: React.FC = () => {
  const { rows, datasets } = useContext(NotebookContext);
  const [savedState, setSavedState] = useState(
    serializeSavedState(rows, datasets)
  );
  const [loading, setLoading] = useState(false);
  const expName = useExperimentName();
  const notebookName = useNotebookName();

  const hasUnsavedChanges = useMemo(() => {
    return savedState !== serializeSavedState(rows, datasets);
  }, [datasets, rows, savedState]);

  const handleSave = async () => {
    try {
      await updateNotebook({
        experimentName: expName,
        notebookName: notebookName,
        rows,
        datasetMetadata: datasets.map((d) => ({
          experimentName: d.experimentName,
          evalName: d.evalName,
          label: d.label,
        })),
      });
      setSavedState(serializeSavedState(rows, datasets));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`Failed to save notebook: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Button
        disabled={!hasUnsavedChanges}
        loading={loading}
        variant="contained"
        onClick={handleSave}
      >
        Save
      </Button>
    </Box>
  );
};

export default ExperimentReportPageAction;
