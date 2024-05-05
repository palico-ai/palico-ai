'use client';
import { Box, Button, TextField } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { ExperimentDataContext, LabExperimentModel } from './data.context';

const QuicklabTopbarNav: React.FC = () => {
  const { experiments } = useContext(ExperimentDataContext);
  const [savedExperiments, setSavedExperiments] =
    React.useState<LabExperimentModel[]>(experiments);
  const [needsSave, setNeedsSave] = React.useState(false);

  useEffect(() => {
    if (
      !needsSave &&
      JSON.stringify(experiments) !== JSON.stringify(savedExperiments)
    ) {
      setNeedsSave(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experiments]);

  const handleSave = () => {
    setNeedsSave(false);
    setSavedExperiments(experiments);
    console.log('Save');
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
      >
        Save
      </Button>
      <TextField
        sx={{
          minWidth: 200,
        }}
        size="small"
        variant="outlined"
        select
        label="Select View"
      />
      <Button variant="contained" color="secondary">
        Create New View
      </Button>
    </Box>
  );
};

export default QuicklabTopbarNav;
