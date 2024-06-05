import { ExperimentTestKeyID } from '@palico-ai/common';
import { getTestByName } from '../../../../../services/experiments';
import React from 'react';
import PageContent from '../../../../../components/layout/page_content';
import MultiTestCompareTable from './compare_table';
import { ExperimentItemChildPage } from '../../../../../types/component_types';
import Breadcrumb from '../../../../../utils/breadcrumb';

export interface TestReportItemPageProps extends ExperimentItemChildPage {
  searchParams: {
    name: string;
    tests: string;
  };
}

const NewTestReportPage: React.FC<TestReportItemPageProps> = async (props) => {
  const { tests: testString } = props.searchParams;
  const tests = JSON.parse(testString) as ExperimentTestKeyID[];
  const testDatasets = await Promise.all(
    tests.map((test) => getTestByName(test.experimentName, test.testName))
  );
  return (
    <PageContent
      breadcrumb={[
        Breadcrumb.experimentList({ includeHref: true }),
        Breadcrumb.newReport(),
      ]}
    >
      <MultiTestCompareTable tests={testDatasets} />
    </PageContent>
  );
};

export default NewTestReportPage;
