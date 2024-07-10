'use client';

import { Box } from '@mui/material';
import { Button } from '@palico-ai/components';
import React, { useContext } from 'react';
import NotebookContext from '../notebook.context';

const ExperimentReportPageAction: React.FC = () => {
  const { rows, datasets } = useContext(NotebookContext);

  return (
    <Box>
      <Button
        variant="contained"
        onClick={() => {
          console.log({
            rows,
            datasets: datasets.map((d) => ({
              experimentName: d.experimentName,
              evalName: d.evalName,
              label: d.label,
            })),
          });
        }}
      >
        Save
      </Button>
    </Box>
  );
};

export default ExperimentReportPageAction;
