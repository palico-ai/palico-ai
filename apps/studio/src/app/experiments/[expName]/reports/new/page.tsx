import { TestNameWithExperiment } from '@palico-ai/common';
import { getTestByName } from '../../../../../services/experiments';
import React from 'react';
import PageContent from '../../../../../components/layout/page_content';
import MultiTestCompareTable from './compare_table';
import { RoutePath } from '../../../../../utils/route_path';
import { ExperimentItemChildPage } from '../../../../../types/component_types';

export interface TestReportItemPageProps extends ExperimentItemChildPage {
  searchParams: {
    name: string;
    tests: string;
  };
}

const NewTestReportPage: React.FC<TestReportItemPageProps> = async (props) => {
  const { tests: testString } = props.searchParams;
  const { expName } = props.params;
  const tests = JSON.parse(testString) as TestNameWithExperiment[];
  console.log('tests', tests);
  const testDatasets = await Promise.all(
    tests.map((test) => getTestByName(test.experimentName, test.testName))
  );
  console.log('testDatasets', testDatasets);
  return (
    <PageContent
      breadcrumb={[
        { label: 'Experiments', href: RoutePath.experimentList() },
        {
          label: expName,
          href: RoutePath.experimentItem({ experimentName: expName }),
        },
        { label: 'New Report' },
      ]}
    >
      <MultiTestCompareTable tests={testDatasets} />
    </PageContent>
  );
};

export default NewTestReportPage;
