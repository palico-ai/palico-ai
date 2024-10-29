import React from 'react';
import PageContent from '../../../components/layout/page_content';
import LabList from './lab_list';
import { Box } from '@mui/material';
import Breadcrumb from '../../../utils/breadcrumb';

export const dynamic = 'force-dynamic';

const LabListPage: React.FC = async () => {
  return (
    <PageContent breadcrumb={[Breadcrumb.quickLab()]}>
      <Box>
        <LabList />
      </Box>
    </PageContent>
  );
};

export default LabListPage;
