import { ExperimentItemChildPage } from '../../../../types/component_types';
import PageContent from '../../../../components/layout/page_content';
import React from 'react';
import { ExperimentItemPageTabItemList } from '../../../../constants/ui';

const ExperimentReportPage: React.FC<ExperimentItemChildPage> = ({
  params: { expName },
}) => {
  return (
    <PageContent navItems={ExperimentItemPageTabItemList(expName)}>
      <h1>Experiment Report</h1>
    </PageContent>
  );
};

export default ExperimentReportPage;
