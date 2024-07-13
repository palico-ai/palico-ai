import { Box, Grid, Typography } from '@mui/material';
import { Editor, LoomEmbed, TabPanel, TabView } from '@palico-ai/components';
import React, { useMemo } from 'react';
import { CodeSnippetTabFragment } from './client_fragments';

interface HowItWorksSectionLayoutProps {
  title?: string;
  descriptions: (string | React.ReactElement)[];
  codeSnippet?: string;
  media?: React.ReactNode;
  centerContent?: boolean;
  embedURL?: string;
  disableGutter?: boolean;
}

const DESCRIPTION_FONT_SIZE = 17;

export const ContentWithMedia: React.FC<HowItWorksSectionLayoutProps> = ({
  title,
  descriptions,
  codeSnippet,
  media,
  embedURL,
  centerContent,
  disableGutter,
}) => {
  const demoContent = useMemo(() => {
    if (media) {
      return media;
    }
    if (embedURL) {
      return <LoomEmbed url={embedURL} />;
    }
    if (codeSnippet) {
      return (
        <Editor
          options={{
            readOnly: true,
            minimap: {
              enabled: false,
            },
          }}
          language="typescript"
          value={codeSnippet}
        />
      );
    }
    return null;
  }, [codeSnippet, embedURL, media]);

  return (
    <Grid
      container
      spacing={12}
      sx={{
        mb: disableGutter ? 0 : 12,
      }}
    >
      <Grid
        item
        md={6}
        sm={12}
        xs={12}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: centerContent ? 'center' : 'flex-start',
        }}
      >
        {title && (
          <Typography variant="h4" mb={2}>
            {title}
          </Typography>
        )}
        {descriptions.map((description, index) => (
          <Typography
            key={index}
            variant="body1"
            mb={2}
            fontSize={DESCRIPTION_FONT_SIZE}
          >
            {description}
          </Typography>
        ))}
      </Grid>
      <Grid item md={6} sm={12} xs={12}>
        {demoContent}
      </Grid>
    </Grid>
  );
};

export interface HowItWorksTextStepProps {
  title: string;
  descriptions: string[];
}

export const HowItWorksTextStep: React.FC<HowItWorksTextStepProps> = ({
  title,
  descriptions,
}) => {
  return (
    <Box>
      <Typography variant="h4" mb={2}>
        {title}
      </Typography>
      {descriptions.map((description, index) => (
        <Typography
          key={index}
          variant="body1"
          mb={2}
          fontSize={DESCRIPTION_FONT_SIZE}
        >
          {description}
        </Typography>
      ))}
    </Box>
  );
};

export interface CodeSnippetTabProps {
  tabs: {
    label: string;
    codeSnippet: string;
  }[];
  height?: number;
}

export const CodeSnippetTab: React.FC<CodeSnippetTabProps> = ({
  tabs,
  height = 250,
}) => {
  return (
    <TabView
      tabs={tabs.map((tab) => ({
        label: tab.label,
        value: tab.label,
      }))}
    >
      {tabs.map((tab) => (
        <TabPanel key={tab.label} value={tab.label}>
          <CodeSnippetTabFragment
            codeSnippet={tab.codeSnippet}
            height={height}
          />
        </TabPanel>
      ))}
    </TabView>
  );
};
