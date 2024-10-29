import React from 'react';
import PageContent from '../../../components/layout/page_content';
import ExperimentList from './experiment_list';
import { Box } from '@mui/material';
import Breadcrumb from '../../../utils/breadcrumb';

export const dynamic = 'force-dynamic';

const ExperimentListPage: React.FC = async () => {
  return (
    <PageContent breadcrumb={[Breadcrumb.experimentList()]}>
      <Box>
        <ExperimentList />
      </Box>
    </PageContent>
  );
};

export default ExperimentListPage;
