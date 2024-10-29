import ExperimentSubpageLayout from '../../../../../components/layout/experiment_page_tab';
import PageContent from '../../../../../components/layout/page_content';
import React from 'react';
import Breadcrumb from '../../../../../utils/breadcrumb';
import { ExperimentItemChildPage } from '../../../../../types/component_types';
import NotebookListTopbarAction from './__components__/topbar_action';
import NotebookList from './__components__/notebook_list';

const ExperimentNotebookListPage: React.FC<ExperimentItemChildPage> = async ({
  params: { expName },
}) => {
  return (
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
        <NotebookList expName={decodeURI(expName)} />
      </ExperimentSubpageLayout>
    </PageContent>
  );
};

export default ExperimentNotebookListPage;
