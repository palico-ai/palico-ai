import PageContent from '../../../components/layout/page_content';
import React from 'react';
import PageHeaderAction from './page_header_action';
import { AnalysisContextProvider } from './analysis.context';
import DataframeList from './dataframe_list';

const ExperimentAnalysisPage: React.FC = () => {
  return (
    <AnalysisContextProvider>
      <PageContent
        breadcrumb={[{ label: 'Anlysis' }]}
        actions={<PageHeaderAction />}
      >
        <DataframeList />
      </PageContent>
    </AnalysisContextProvider>
  );
};

export default ExperimentAnalysisPage;
