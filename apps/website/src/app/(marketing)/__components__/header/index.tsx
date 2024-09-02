'use client';

import { Box, Container, Divider, styled } from '@mui/material';
import { Button, LinkButton, Typography } from '@palico-ai/components';
import React from 'react';
import DocsIcon from '@mui/icons-material/ImportContacts';
import GitHubIcon from '@mui/icons-material/GitHub';
import RoutePath from '../../../../utils/route_path';

const HighlightSpan = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
}));

const LandingPageHeader: React.FC = () => {
  return (
    <Box>
      <Container
        maxWidth="md"
        sx={{
          my: {
            xs: 8,
            sm: 16,
            md: 20,
          },
          gap: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1">
          Rapidly <HighlightSpan>Iterate</HighlightSpan> on your{' '}
          <HighlightSpan>LLM Development</HighlightSpan>
        </Typography>
        <Typography variant="body2" fontSize={20}>
          Streamline your process for iterating through hundreds of combinations
          of models, prompts, and custom logic to find the best performing
          configuration for your application
        </Typography>
        <Divider
          sx={{
            my: 3,
            width: '100%',
            boxSizing: 'border-box',
          }}
        />
        <LinkButton
          href={RoutePath.quickStart()}
          color="primary"
          variant="contained"
          size="large"
        >
          Start Your Project
        </LinkButton>
        <Box
          sx={{
            display: 'flex',
            flexDirection: {
              xs: 'column',
              md: 'row',
            },
            gap: 2,
            mt: 2,
          }}
        >
          <LinkButton
            href={RoutePath.docs()}
            startIcon={<DocsIcon />}
            size="large"
            color="secondary"
          >
            Read the Docs
          </LinkButton>
          <Button
            href={RoutePath.github()}
            startIcon={<GitHubIcon />}
            size="large"
            color="secondary"
          >
            We Are Open Source
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPageHeader;
