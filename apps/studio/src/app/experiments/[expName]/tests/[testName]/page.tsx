import { ExperimentTestChildPage } from '../../../../../types/component_types';
import PageContent from '../../../../../components/layout/page_content';
import React from 'react';
import { getTestByName } from '../../../../../services/experiments';
import TestResultTable from './test_result_table';
import ExperimentTestTopbarAction from './topbar_action';
import Breadcrumb from '../../../../../utils/breadcrumb';

const ExperimentTestPage: React.FC<ExperimentTestChildPage> = async ({
  params: { expName, testName },
}) => {
  const test = await getTestByName(expName, testName);

  return (
    <PageContent
      breadcrumb={[
        Breadcrumb.experimentList({ includeHref: true }),
        Breadcrumb.experimentItem({
          experimentName: expName,
          includeHref: true,
        }),
        Breadcrumb.experimentTestList({
          includeHref: true,
          options: { experimentName: expName },
        }),
        Breadcrumb.experimentTestItem({ testName }),
      ]}
      actions={<ExperimentTestTopbarAction />}
    >
      <TestResultTable test={test} />
    </PageContent>
  );
};

export default ExperimentTestPage;
