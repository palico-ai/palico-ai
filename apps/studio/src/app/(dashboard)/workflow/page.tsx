import PageContent from '../../../components/layout/page_content';
import React from 'react';
import WorkflowPageContent from './content';
import Breadcrumb from '../../../utils/breadcrumb';

const WorkflowPage: React.FC = () => {
  return (
    <PageContent breadcrumb={[Breadcrumb.workflowList()]}>
      <WorkflowPageContent />
    </PageContent>
  );
};

export default WorkflowPage;
