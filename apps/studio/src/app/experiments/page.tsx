import React from 'react';
import PageContent from '../../components/layout/page_content';
import ExperimentList from './experiment_list';
import { Box } from '@mui/material';
import { getExperimentList } from '../../services/experiments';
import Breadcrumb from '../../utils/breadcrumb';

export const dynamic = 'force-dynamic';

const ExperimentListPage: React.FC = async () => {
  const experiments = await getExperimentList();

  return (
    <PageContent breadcrumb={[Breadcrumb.experimentList()]}>
      <Box>
        <ExperimentList initialExpItems={experiments} />
      </Box>
    </PageContent>
  );
};

export default ExperimentListPage;
