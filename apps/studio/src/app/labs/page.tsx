import React from 'react';
import { getAllLabViews } from '../../services/studio';
import PageContent from '../../components/layout/page_content';
import LabList from './lab_list';
import { Box } from '@mui/material';

export const dynamic = 'force-dynamic';

const LabListPage: React.FC = async () => {
  const labList = await getAllLabViews();

  return (
    <PageContent breadcrumb={[{ label: 'Labs' }]}>
      <Box>
        <LabList initialLabItems={labList} />
      </Box>
    </PageContent>
  );
};

export default LabListPage;
