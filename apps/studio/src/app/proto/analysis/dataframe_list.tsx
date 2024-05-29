'use client';

import React, { useContext } from 'react';
import AnalysisContext from './analysis.context';
import { Box } from '@mui/material';
import DataframeView from './__components__/dataframe';

const DataframeList: React.FC = () => {
  const { dataframes: dataframes } = useContext(AnalysisContext);

  return (
    <Box>
      {dataframes.map((dataframe, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <DataframeView dataframe={dataframe} />
        </Box>
      ))}
    </Box>
  );
};

export default DataframeList;
