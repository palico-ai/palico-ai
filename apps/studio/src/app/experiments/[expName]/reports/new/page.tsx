import { EvalJobKeyID } from '@palico-ai/common';
import { getEvalByName } from '../../../../../services/experiments';
import React from 'react';
import PageContent from '../../../../../components/layout/page_content';
import MultiEvalCompareTable from './compare_table';
import { ExperimentItemChildPage } from '../../../../../types/component_types';
import Breadcrumb from '../../../../../utils/breadcrumb';

export interface TestReportItemPageProps extends ExperimentItemChildPage {
  searchParams: {
    name: string;
    evals: string;
  };
}

const NewTestReportPage: React.FC<TestReportItemPageProps> = async (props) => {
  const { evals: evalString } = props.searchParams;
  const tests = JSON.parse(evalString) as EvalJobKeyID[];
  const testDatasets = await Promise.all(
    tests.map((test) => getEvalByName(test.experimentName, test.evalName))
  );
  return (
    <PageContent
      breadcrumb={[
        Breadcrumb.experimentList({ includeHref: true }),
        Breadcrumb.newReport(),
      ]}
    >
      <MultiEvalCompareTable evals={testDatasets} />
    </PageContent>
  );
};

export default NewTestReportPage;
