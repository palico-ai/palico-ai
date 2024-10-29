import { EvalChildPage } from '../../../../../../types/component_types';
import PageContent from '../../../../../../components/layout/page_content';
import React from 'react';
import { getEvalByName } from '../../../../../../services/experiments';
import TestResultTable from './test_result_table';
import ExperimentTestTopbarAction from './topbar_action';
import Breadcrumb from '../../../../../../utils/breadcrumb';

const ExperimentTestPage: React.FC<EvalChildPage> = async ({
  params: { expName, evalName: testName },
}) => {
  // Okay to prefetch since eval content doesn't ever change
  const test = await getEvalByName(expName, testName);

  return (
    <PageContent
      breadcrumb={[
        Breadcrumb.experimentList({ includeHref: true }),
        Breadcrumb.experimentItem({
          experimentName: expName,
          includeHref: true,
        }),
        Breadcrumb.experimentEvalList({
          includeHref: true,
          options: { experimentName: expName },
        }),
        Breadcrumb.experimentEvalItem({ evalName: testName }),
      ]}
      actions={<ExperimentTestTopbarAction />}
    >
      <TestResultTable test={test} />
    </PageContent>
  );
};

export default ExperimentTestPage;
