import React from 'react';
import SectionLayout from '../section_layout';
import { Grid } from '@mui/material';
import {
  APIAndSDK,
  Analysis,
  Evaluation,
  Experimentation,
  LLMDevelopmentFramework,
  Observability,
  Prototype,
  VersionControl,
  Workflows,
} from './build';

const GRID_SPACING = 2;

const FrameworkComponents: React.FC = () => {
  return (
    <SectionLayout title={'Learn more about the Framework'} disableTitleGutter>
      <Grid
        container
        spacing={GRID_SPACING}
        columnSpacing={GRID_SPACING}
        mt={4}
      >
        <Grid item xs={12} md={5}>
          <LLMDevelopmentFramework />
        </Grid>
        <Grid container item xs={12} md={7} spacing={GRID_SPACING}>
          <Grid item xs={12}>
            <Workflows />
          </Grid>
          <Grid item xs={12}>
            <Observability />
          </Grid>
          <Grid item xs={12}>
            <APIAndSDK />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Prototype />
        </Grid>
        <Grid container item xs={12} md={7} spacing={GRID_SPACING}>
          <Grid item xs={12}>
            <Evaluation />
          </Grid>
          <Grid item xs={12}>
            <Analysis />
          </Grid>
          <Grid item xs={12}>
            <VersionControl />
          </Grid>
        </Grid>
        <Grid item xs={12} md={5}>
          <Experimentation />
        </Grid>
      </Grid>
    </SectionLayout>
  );
};

export default FrameworkComponents;
