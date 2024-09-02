import { Grid } from '@mui/material';
import React from 'react';
import SectionLayout from '../section_layout';
import { HighlightSpan } from '../client_fragments';
import ControlPanelCard, { ControlPanelCardProps } from './control_panel_card';
import ChatUI from './chat_ui.png';
import QuickLab from './comparison.png';
import ExperimentList from './experiments.png';
import TraceView from './tracing.png';

const STUDIO_SLIDES: ControlPanelCardProps[] = [
  {
    title: 'Preview your Changes in Chat UI',
    image: ChatUI,
  },
  {
    title: 'Compare Responses Side-By-Side',
    image: QuickLab,
  },
  {
    title: 'Run, Track, and Analyze Experiments',
    image: ExperimentList,
  },
  {
    title: 'Review Traces of every Request',
    image: TraceView,
  },
];

const PalicoStudio: React.FC = () => {
  return (
    <SectionLayout
      title="Control Panel That Accelerates Your Development"
      subtitle={
        <>
          Your application comes with Palico Studio, a control panel that{' '}
          <HighlightSpan>runs locally</HighlightSpan> during development, and{' '}
          <HighlightSpan>in the cloud</HighlightSpan> during production
        </>
      }
    >
      <Grid
        container
        spacing={12}
        sx={{
          boxSizing: 'border-box',
        }}
      >
        {STUDIO_SLIDES.map((slide) => (
          <Grid item xs={12} md={6} key={slide.title}>
            <ControlPanelCard title={slide.title} image={slide.image} />
          </Grid>
        ))}
      </Grid>
    </SectionLayout>
  );
};

export default PalicoStudio;
