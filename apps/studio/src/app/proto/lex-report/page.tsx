import React from 'react';
import PageContent from '../../../components/layout/page_content';
import Editor from './__components__/editor';
import { Container, Typography } from '@mui/material';

const ReportPage: React.FC = () => {
  return (
    <PageContent breadcrumb={[{ label: 'Reports' }]}>
      <Container>
        <Typography variant="h2" px={'9px'}>
          Report Title
        </Typography>
        <Editor />
      </Container>
    </PageContent>
  );
};

export default ReportPage;
