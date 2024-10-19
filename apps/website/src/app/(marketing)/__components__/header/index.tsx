'use client';

import { Box, Container, Divider, styled } from '@mui/material';
import { Button, LinkButton, Typography } from '@palico-ai/components';
import React from 'react';
import DocsIcon from '@mui/icons-material/ImportContacts';
import GitHubIcon from '@mui/icons-material/GitHub';
import AppRoute, { DocRoute } from '../../../../utils/route_path';
import ApplicationAttributes from './attributes';

const HighlightSpan = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, #e03466 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const LandingPageHeader: React.FC = () => {
  return (
    <Box
      mb={24}
      sx={{
        my: {
          xs: 8,
          sm: 16,
          md: 20,
        },
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          gap: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1">
          LLM <HighlightSpan> Tech Stack</HighlightSpan> for{' '}
          <HighlightSpan>Rapid Iteration</HighlightSpan>
        </Typography>
        <Typography
          variant="subtitle1"
          fontSize={20}
          sx={{
            opacity: 0.7,
          }}
        >
          Building an LLM application requires continuously trying out different
          ideas (models, prompts, architectures). Quickly iterate on your LLM
          project with an integrated tech stack.
        </Typography>
        <Divider
          sx={{
            my: 3,
            width: '100%',
            boxSizing: 'border-box',
          }}
        />
        <LinkButton
          href={DocRoute.quickStart()}
          color="primary"
          variant="contained"
          // size="large"
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
            href={DocRoute.docs()}
            startIcon={<DocsIcon />}
            size="large"
            color="secondary"
          >
            Read the Docs
          </LinkButton>
          <Button
            href={AppRoute.github()}
            startIcon={<GitHubIcon />}
            size="large"
            color="secondary"
          >
            We Are Open Source
          </Button>
        </Box>
      </Container>
      <ApplicationAttributes />
    </Box>
  );
};

export default LandingPageHeader;
