import Breadcrumb from '../../../../utils/breadcrumb';
import PageContent from '../../../../components/layout/page_content';
import React from 'react';
import { ExperimentItemChildPage } from '../../../../types/component_types';
import Notebook from './__components__/notebook';
import { NotebookProvider } from './__components__/notebook.context';
import ExperimentReportPageAction from './__components__/pg_action';
import initialData from './initial_data.json';
import { getEvalByName } from '../../../../services/experiments';
import { Dataset, NotebookWidget } from './__components__/types';

const ExperimentAnalysisPage: React.FC<ExperimentItemChildPage> = async ({
  params: { expName },
}) => {
  const datasets: Dataset[] = await Promise.all(
    initialData.datasets.map(async (d) => {
      const ds = await getEvalByName(d.experimentName, d.evalName);
      return {
        ...d,
        data: ds,
      };
    })
  );

  return (
    <NotebookProvider
      initialDatasets={datasets}
      initialRows={initialData.rows as NotebookWidget[]}
    >
      <PageContent
        breadcrumb={[
          Breadcrumb.experimentList({ includeHref: true }),
          Breadcrumb.experimentItem({
            experimentName: expName,
            includeHref: true,
          }),
        ]}
        actions={<ExperimentReportPageAction />}
      >
        <Notebook />
      </PageContent>
    </NotebookProvider>
  );
};

export default ExperimentAnalysisPage;
