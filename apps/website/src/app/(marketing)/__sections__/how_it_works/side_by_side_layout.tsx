import { Box, Grid, Typography } from '@mui/material';
import { Editor, LoomEmbed } from '@palico-ai/components';
import React, { useMemo } from 'react';

interface HowItWorksSectionLayoutProps {
  title: string;
  descriptions: string[];
  codeSnippet?: string;
  maxHeight?: number;
  embedURL?: string;
  disableGutter?: boolean;
}

const HowItWorksStepWithMedia: React.FC<HowItWorksSectionLayoutProps> = ({
  title,
  descriptions,
  codeSnippet,
  maxHeight = 250,
  embedURL,
  disableGutter,
}) => {
  const demoContent = useMemo(() => {
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
  }, [codeSnippet, embedURL]);

  return (
    <Grid
      container
      spacing={12}
      sx={{
        mb: disableGutter ? 0 : 12,
      }}
    >
      <Grid item md={6} sm={12} xs={12}>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        {descriptions.map((description, index) => (
          <Typography key={index} variant="body2" mb={2}>
            {description}
          </Typography>
        ))}
      </Grid>
      <Grid
        item
        md={6}
        sm={12}
        xs={12}
        sx={{
          ...(codeSnippet !== undefined
            ? {
                height: maxHeight ?? '100%',
                maxWidth: '100%',
              }
            : {}),
        }}
      >
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
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      {descriptions.map((description, index) => (
        <Typography key={index} variant="body2" mb={2}>
          {description}
        </Typography>
      ))}
    </Box>
  );
};

export default HowItWorksStepWithMedia;
