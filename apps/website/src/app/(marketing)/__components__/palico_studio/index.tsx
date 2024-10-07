import { Box } from '@mui/material';
import React from 'react';
import SectionLayout from '../section_layout';
import { TabView } from '@palico-ai/components';
import PalicoStudioSlideContent from './slide';
import { CDNContent } from '../../../../utils/cdn';

enum StudioSlide {
  PreviewChanges = 'preview',
  ManageExperiments = 'experiments',
  TraceRequests = 'tracing',
}

const PalicoStudio: React.FC = () => {
  return (
    <SectionLayout title="Control Panel That Accelerates Your Development">
      <TabView
        tabs={[
          {
            label: 'Preview Your Changes',
            value: StudioSlide.PreviewChanges,
          },
          {
            label: 'Manage Experiments',
            value: StudioSlide.ManageExperiments,
          },
          {
            label: 'Logs and Tracing',
            value: StudioSlide.TraceRequests,
          },
        ]}
      >
        <Box mt={4}>
          <PalicoStudioSlideContent
            value={StudioSlide.PreviewChanges}
            description="Make changes and preview them in real-time with Chat UI"
            video={CDNContent.Video.PreviewApplicationClip}
          />
          <PalicoStudioSlideContent
            value={StudioSlide.ManageExperiments}
            description="Run, track, and analyze experiments from an intuitive dashboard"
            video={CDNContent.Video.ExperimentVideoClip}
          />
          <PalicoStudioSlideContent
            value={StudioSlide.TraceRequests}
            description="Debug issues with detailed logs and traces for every request"
            video={CDNContent.Video.TraceRequestClip}
          />
        </Box>
      </TabView>
    </SectionLayout>
  );
};

export default PalicoStudio;
