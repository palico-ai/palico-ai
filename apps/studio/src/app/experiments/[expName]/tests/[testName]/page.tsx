import { ExperimentTestChildPage } from '../../../../../types/component_types';
import PageContent from '../../../../../components/layout/page_content';
import React from 'react';
import { RoutePath } from '../../../../../utils/route_path';
import { getTestByName } from '../../../../../services/experiments';
import TestResultTable from './test_result_table';
import ExperimentTestTopbarAction from './topbar_action';

const ExperimentTestPage: React.FC<ExperimentTestChildPage> = async ({
  params: { expName, testName },
}) => {
  const test = await getTestByName(expName, testName);

  console.log(test);

  return (
    <PageContent
      breadcrumb={[
        { label: 'Experiments', href: RoutePath.experimentList() },
        {
          label: expName,
          href: RoutePath.experimentItem({
            experimentName: expName,
          }),
        },
        {
          label: 'Tests',
          href: RoutePath.experimentTestList({
            experimentName: expName,
          }),
        },
        { label: testName },
      ]}
      navItems={[
        {
          label: 'Experiment Analysis',
          href: RoutePath.experimentReportItem({
            experimentName: test.experimentName,
          }),
        },
      ]}
      actions={<ExperimentTestTopbarAction />}
    >
      <TestResultTable test={test} />
    </PageContent>
  );
};

export default ExperimentTestPage;
