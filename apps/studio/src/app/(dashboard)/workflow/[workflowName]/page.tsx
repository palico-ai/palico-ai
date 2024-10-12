import Breadcrumb from '../../../../utils/breadcrumb';
import PageContent from '../../../../components/layout/page_content';
import { WorkflowItemChildPage } from '../../../../types/component_types';
import React from 'react';
import WorkflowDefinitionView from './definition';
import { ComponentWithChildren, Typography } from '@palico-ai/components';
import { Divider, Paper } from '@mui/material';

interface SectionProps extends ComponentWithChildren {
  name: string;
}

const Section: React.FC<SectionProps> = ({ name, children }) => {
  return (
    <Paper sx={{ mb: 2, p: 2 }}>
      <Typography variant="h6" textAlign={'left'}>
        {name}
      </Typography>
      <Divider sx={{ my: 1 }} />
      {children}
    </Paper>
  );
};

const WorkflowItemPage: React.FC<WorkflowItemChildPage> = ({
  params: { workflowName },
}) => {
  return (
    <PageContent
      breadcrumb={[
        Breadcrumb.workflowList({ includeHref: true }),
        Breadcrumb.workflowItem({ workflowName }),
      ]}
    >
      <Section name="Definition">
        <WorkflowDefinitionView />
      </Section>
    </PageContent>
  );
};

export default WorkflowItemPage;
