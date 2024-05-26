import React from 'react';
import PageContent from '../../components/layout/page_content';
import ExperimentList from './experiment_list';
import { Box } from '@mui/material';
import { getExperimentList } from '../../services/experiments';

export const dynamic = 'force-dynamic';

const ExperimentListPage: React.FC = async () => {
  const experiments = await getExperimentList();

  return (
    <PageContent title="Experiments">
      <Box sx={{ m: 4 }}>
        <ExperimentList initialExpItems={experiments} />
      </Box>
    </PageContent>
  );
};

export default ExperimentListPage;
