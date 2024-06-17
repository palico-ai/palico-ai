'use client';

import React from 'react';
import SectionLayout from '../section_layout';
import { Button, Link, Typography } from '@palico-ai/components';
import { Box, Container, MobileStepper, Paper } from '@mui/material';

const quotes: EvidenceQuoteProps[] = [
  {
    quote:
      'Users should conduct evaluation in an iterative and continuous manner [aka. experimentation], and update and refine their evaluation data, metrics, methods, and actions based on the feedback and findings from the evaluation.',
    quotee: 'Microsoft',
    referenceTitle: 'Best Practices and Challenges of Evaluation Flows',
    learnMoreURL:
      'https://techcommunity.microsoft.com/t5/ai-azure-ai-services-blog/evaluation-flows-for-large-language-models-llm-in-azure-ai/ba-p/4153110#:~:text=These%20systematic%20procedures%20help%20you%20assess%20and%20improve%20the%20LLM%27s%20outputs%2C%20making%20it%20easier%20to%20spot%20and%20fix%20errors%2C%20biases%2C%20and%20potential%20risks',
  },
  {
    quote:
      'Sometimes it can be hard to tell whether a change — e.g., a new instruction or a new design — makes your system better or worse. Looking at a few examples may hint at which is better, but with small sample sizes it can be hard to distinguish between a true improvement or random luck.',
    quotee: 'Open AI',
    referenceTitle: 'Strategy: Test Changes Systematically',
    learnMoreURL:
      'https://platform.openai.com/docs/guides/prompt-engineering/strategy-use-external-tools',
  },
  {
    quote:
      'The behavior we witnessed in our evals (experimentation) and from what we know about this question told us that this is a behavior optimization problem where additional context will not necessarily help the model.',
    quotee: 'Open AI',
    referenceTitle: 'On learnings from systematic experimentations',
    learnMoreURL:
      'https://platform.openai.com/docs/guides/optimizing-llm-accuracy/understanding-the-tools',
  },
  {
    quote:
      'It’s time to recognize that evaluation is not a one-time endeavor but a multi-step, iterative process that has a significant impact on the performance and longevity of your LLM application.',
    quotee: 'Jane Huang',
    referenceTitle: 'Published in Data Science at Microsoft',
    learnMoreURL:
      'https://platform.openai.com/docs/guides/prompt-engineering/strategy-use-external-tools',
  },
];

interface EvidenceQuoteProps {
  quote: string;
  quotee: string;
  referenceTitle: string;
  learnMoreURL: string;
}

const EvidenceQuote: React.FC<EvidenceQuoteProps> = ({
  quote,
  quotee,
  referenceTitle,
  learnMoreURL,
}) => {
  return (
    <Box p={4}>
      <Typography variant="body2" mb={3}>
        {quote}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: {
            xs: 'column',
            md: 'row',
          },
          justifyContent: 'space-between',
          alignItems: {
            xs: 'flex-start',
            md: 'flex-end',
          },
        }}
      >
        <Box>
          <Typography variant="h6" fontSize={18} gutterBottom>
            {quotee}
          </Typography>
          <Typography variant="caption" fontSize={14}>
            {referenceTitle}
          </Typography>
        </Box>
        <Box
          sx={{
            alignSelf: 'flex-end',
          }}
        >
          <Link href={learnMoreURL} target="_blank">
            <Button
              color="secondary"
              variant="text"
              sx={{
                mt: 1,
              }}
            >
              Read More
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};
const EvidenceSection: React.FC = () => {
  const [activeStep, setActiveStep] = React.useState(0);

  return (
    <SectionLayout
      title="Iterative Testing Leads to Accuracy Improvements"
      titleHeader="h4"
      alignTitle={'center'}
      disableTitleGutter
    >
      <Container
        maxWidth="md"
        sx={{
          mt: 4,
        }}
      >
        <Paper elevation={1}>
          <MobileStepper
            sx={(theme) => ({
              backgroundColor: theme.palette.background.paper,
            })}
            variant="dots"
            steps={quotes.length}
            position="static"
            activeStep={activeStep}
            nextButton={
              <Button
                size="small"
                onClick={() =>
                  setActiveStep((prevActiveStep) => prevActiveStep + 1)
                }
                disabled={activeStep === quotes.length - 1}
              >
                Next
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={() =>
                  setActiveStep((prevActiveStep) => prevActiveStep - 1)
                }
                disabled={activeStep === 0}
              >
                Back
              </Button>
            }
          />
          <EvidenceQuote {...quotes[activeStep]} />
        </Paper>
      </Container>
    </SectionLayout>
  );
};

export default EvidenceSection;
