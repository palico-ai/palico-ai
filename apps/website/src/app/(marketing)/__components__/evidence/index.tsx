'use client';

import React from 'react';
import SectionLayout from '../section_layout';
import { Button, Link, Typography } from '@palico-ai/components';
import { Box, Container, MobileStepper, Paper } from '@mui/material';
import Image, { ImageProps } from 'next/image';
import MicrosoftIcon from '../../../../../public/logos/microsoft.svg';
import OpenAIIcon from '../../../../../public/logos/openai.svg';

const LogoImage: React.FC<{
  src: ImageProps['src'];
  backgroundColor?: string;
}> = ({ src, backgroundColor }) => (
  <Image
    src={src}
    width={20}
    height={20}
    alt={''}
    style={{
      borderRadius: '12%',
      backgroundColor: backgroundColor || 'transparent',
    }}
  />
);

const quotes: EvidenceQuoteProps[] = [
  {
    quote:
      'It’s time to recognize that evaluation is not a one-time endeavor but a multi-step, iterative process that has a significant impact on the performance and longevity of your LLM application.',
    quotee: 'Jane Huang',
    icon: <LogoImage src={MicrosoftIcon} />,
    referenceTitle: 'Published in Data Science at Microsoft',
    learnMoreURL:
      'https://medium.com/data-science-at-microsoft/evaluating-llm-systems-metrics-challenges-and-best-practices-664ac25be7e5#:~:text=it%E2%80%99s%20time%20to%20recognize%20that%20evaluation%20is%20not%20a%20one%2Dtime%20endeavor%20but%20a%20multi%2Dstep%2C%20iterative%20process%20that%20has%20a%20significant%20impact%20on%20the%20performance%20and%20longevity%20of%20your%20LLM%20application',
  },
  {
    quote:
      'Users should conduct evaluation in an iterative and continuous manner [aka. experimentation], and update and refine their evaluation data, metrics, methods, and actions based on the feedback and findings from the evaluation.',
    quotee: 'Microsoft',
    icon: <LogoImage src={MicrosoftIcon} />,
    referenceTitle: 'Best Practices and Challenges of Evaluation Flows',
    learnMoreURL:
      'https://techcommunity.microsoft.com/t5/ai-azure-ai-services-blog/evaluation-flows-for-large-language-models-llm-in-azure-ai/ba-p/4153110#:~:text=Conducting%20iterative%20and%20continuous%20evaluation.%20Users%20should%20conduct%20evaluation%20in%20an%20iterative%20and%20continuous%20manner%2C%20and%20update%20and%20refine%20their%20evaluation%20data%2C%20metrics%2C%20methods%2C%20and%20actions%20based%20on%20the%20feedback%20and%20findings%20from%20the%20evaluation.%C2%A0',
  },
  {
    quote:
      'Sometimes it can be hard to tell whether a change — e.g., a new instruction or a new design — makes your system better or worse. Looking at a few examples may hint at which is better, but with small sample sizes it can be hard to distinguish between a true improvement or random luck.',
    quotee: 'Open AI',
    icon: <LogoImage backgroundColor="white" src={OpenAIIcon} />,
    referenceTitle: 'Strategy: Test Changes Systematically',
    learnMoreURL:
      'https://platform.openai.com/docs/guides/prompt-engineering/strategy-use-external-tools',
  },
  {
    quote:
      'The behavior we witnessed in our evals (experimentation) and from what we know about this question told us that this is a behavior optimization problem where additional context will not necessarily help the model.',
    quotee: 'Open AI',
    icon: <LogoImage backgroundColor="white" src={OpenAIIcon} />,
    referenceTitle: 'On learnings from systematic experimentations',
    learnMoreURL:
      'https://platform.openai.com/docs/guides/optimizing-llm-accuracy/understanding-the-tools',
  },
];

interface EvidenceQuoteProps {
  quote: string;
  quotee: string;
  icon?: React.ReactNode;
  referenceTitle: string;
  learnMoreURL: string;
}

const EvidenceQuote: React.FC<EvidenceQuoteProps> = ({
  quote,
  quotee,
  referenceTitle,
  learnMoreURL,
  icon,
}) => {
  return (
    <Box p={4}>
      <Typography variant="body2" mb={3} fontStyle={'italic'}>
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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 1,
            }}
          >
            {icon && <Box sx={{ mr: 1 }}>{icon}</Box>}
            <Typography variant="h6" fontSize={18}>
              {quotee}
            </Typography>
          </Box>
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
      title="Improving LLM Performance is Iterative"
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
