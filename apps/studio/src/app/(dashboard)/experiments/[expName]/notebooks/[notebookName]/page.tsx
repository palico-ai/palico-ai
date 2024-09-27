import Breadcrumb from '../../../../../../utils/breadcrumb';
import PageContent from '../../../../../../components/layout/page_content';
import React from 'react';
import { NotebookChildPage } from '../../../../../../types/component_types';
import Notebook from './__components__/notebook';
import { NotebookProvider } from './__components__/notebook.context';
import ExperimentReportPageAction from './__components__/pg_action';
import {
  getEvalByName,
  getNotebook,
} from '../../../../../../services/experiments';
import { Dataset } from './__components__/types';

const ExperimentAnalysisPage: React.FC<NotebookChildPage> = async ({
  params: { expName, notebookName },
}) => {
  const notebook = await getNotebook({
    experimentName: expName,
    notebookName: notebookName,
  });

  const datasets: Dataset[] = await Promise.all(
    notebook.datasetMetadata.map(async (d) => {
      const ds = await getEvalByName(d.experimentName, d.evalName);
      return {
        ...d,
        data: ds,
      };
    })
  );

  return (
    <NotebookProvider initialDatasets={datasets} initialRows={notebook.rows}>
      <PageContent
        breadcrumb={[
          Breadcrumb.experimentList({ includeHref: true }),
          Breadcrumb.experimentItem({
            experimentName: expName,
            includeHref: true,
          }),
          Breadcrumb.experimentNotebookList({
            includeHref: true,
            options: { experimentName: expName },
          }),
          Breadcrumb.experimentNotebookItem({ notebookName }),
        ]}
        actions={<ExperimentReportPageAction />}
      >
        <Notebook />
      </PageContent>
    </NotebookProvider>
  );
};

export default ExperimentAnalysisPage;
