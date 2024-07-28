import ExperimentSubpageLayout from '../../../../components/layout/experiment_page_tab';
import PageContent from '../../../../components/layout/page_content';
import React from 'react';
import Breadcrumb from '../../../../utils/breadcrumb';
import { ExperimentItemChildPage } from '../../../../types/component_types';
import { unstable_noStore } from 'next/cache';
import { getNotebooksForExperiment } from '../../../../services/experiments';
import NotebookListTopbarAction from './__components__/topbar_action';
import { NotebookListContextProvider } from './__components__/notebook_list.context';
import NotebookList from './__components__/notebook_list';

const ExperimentNotebookListPage: React.FC<ExperimentItemChildPage> = async ({
  params: { expName },
}) => {
  unstable_noStore();
  const notebooks = await getNotebooksForExperiment(expName);

  return (
    <NotebookListContextProvider initialNotebooks={notebooks}>
      <PageContent
        disablePadding
        actions={<NotebookListTopbarAction />}
        breadcrumb={[
          Breadcrumb.experimentList({ includeHref: true }),
          Breadcrumb.experimentItem({
            experimentName: expName,
            includeHref: true,
          }),
          Breadcrumb.experimentEvalList(),
        ]}
      >
        <ExperimentSubpageLayout>
          <NotebookList />
        </ExperimentSubpageLayout>
      </PageContent>
    </NotebookListContextProvider>
  );
};

export default ExperimentNotebookListPage;
