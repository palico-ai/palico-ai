import { Container, Divider, Paper } from '@mui/material';
import { ComponentWithChildren, Typography } from '@palico-ai/components';
import PageContent from '../../../components/layout/page_content';
import React from 'react';
import Breadcrumb from '../../../utils/breadcrumb';
import AccountSettings from './account_section';

interface SectionProps extends ComponentWithChildren {
  title: string;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <Paper
      sx={{
        padding: 2,
        marginBottom: 2,
      }}
    >
      <Typography variant="h6">{title}</Typography>
      <Divider
        sx={{
          my: 2,
        }}
      />
      {children}
    </Paper>
  );
};

const SettingsPage: React.FC = () => {
  return (
    <PageContent breadcrumb={[Breadcrumb.settings()]}>
      <Container
        sx={{
          mt: 4,
        }}
      >
        <Section title="Account">
          <AccountSettings />
        </Section>
      </Container>
    </PageContent>
  );
};

export default SettingsPage;
