import React from 'react';
import SectionLayout from '../section_layout';
import { Typography } from '@palico-ai/components';
import { CodeSnippetTab } from '../layouts';
import {
  langchainCodeSnippet,
  portkeyCodeSnippet,
  simpleAgentCodeSnippet,
} from '../constants';
import { Grid } from '@mui/material';
import { HighlightSpan, LearnMoreButton } from '../client_fragments';
import RoutePath from '../../../../utils/route_path';

const BuildAnyApplicationFragment: React.FC = () => {
  return (
    <SectionLayout title="Build Any Application, Use Any Tools or Libraries">
      <Grid container spacing={6}>
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 3,
          }}
        >
          <Typography variant="body1" fontSize={20} gutterBottom>
            Build your application by implementing the <code>Agent</code>{' '}
            interface. You have <HighlightSpan>complete control</HighlightSpan>{' '}
            over your implementation details, and can utilize any external
            libraries.
          </Typography>
          <LearnMoreButton href={RoutePath.docsBuildApp()} />
        </Grid>
        <Grid item xs={12} md={7}>
          <CodeSnippetTab
            tabs={[
              {
                label: 'Build Your Application',
                codeSnippet: simpleAgentCodeSnippet,
              },
              {
                label: 'Import LangChain',
                codeSnippet: langchainCodeSnippet,
              },
              {
                label: 'Import Portkey',
                codeSnippet: portkeyCodeSnippet,
              },
            ]}
            height={250}
          />
        </Grid>
      </Grid>
    </SectionLayout>
  );
};

export default BuildAnyApplicationFragment;
