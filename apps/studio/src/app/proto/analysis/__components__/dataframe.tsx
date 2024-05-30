import { Box, Paper } from '@mui/material';
import { Button, Typography } from '@palico-ai/components';
import React from 'react';
import { Dataframe } from '../analysis.context';
import DatasetTabPanel from './dataset_table';

export interface DataframeViewParams {
  dataframe: Dataframe;
}

const DataframeView: React.FC<DataframeViewParams> = ({ dataframe }) => {
  return (
    <Paper>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
        }}
      >
        <Typography variant="h6">{dataframe.label}</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="contained" color="secondary" size="small">
          Dataset
        </Button>
      </Box>
      <Box sx={{ p: 2 }}>
        <DatasetTabPanel dataset={dataframe.dataset} />
      </Box>
    </Paper>
  );
};

export default DataframeView;
