'use client';

import React, { useMemo } from 'react';
import SectionLayout from '../section_layout';
import { Button, Editor, Typography } from '@palico-ai/components';
import {
  Stepper,
  Step,
  StepLabel as MUIStepLabel,
  StepContent,
  Box,
  Grid,
  styled,
  Paper,
} from '@mui/material';
import LifecycleDiagram from './iterate.svg';
import Image from 'next/image';
import { HighlightSpan, LearnMoreButton } from '../client_fragments';
import EvalGif from './evaluation.gif';
import AnalyzeExp from './analyze.gif';
import { DocRoute } from '../../../../utils/route_path';

const testCaseCodeSnippet = `[
  {
    input: { // input to the application
      userMessage:
        'Given the equation 2x + 3 = 7, solve for x.',
    },
    metrics: [ // measure response performance
      new SemanticSimilarity([
        "Answer: x = 2",
        "x = 2",
        "2",
      ]),
    ]
  },
  {
    input: {
      userMessage: 'What is the capital of France?',
    }
    metrics: [
      new ContainsMetric({
        substring: 'Paris',
      }),
    ],
  },
  ...
]`;

interface StepLabelProps {
  index: number;
  setActiveStep: (index: number) => void;
  label: string;
}

const StepLabel: React.FC<StepLabelProps> = ({
  index,
  setActiveStep,
  label,
}) => {
  return (
    <MUIStepLabel
      sx={{
        cursor: 'pointer',
      }}
      onClick={() => {
        setActiveStep(index);
      }}
    >
      <Typography variant="h5">{label}</Typography>
    </MUIStepLabel>
  );
};

interface StepSplitContentProps {
  description: string;
  stepControl?: React.ReactNode;
  children: React.ReactNode;
}

const StepSplitContent: React.FC<StepSplitContentProps> = ({
  stepControl,
  description,
  children,
}) => {
  return (
    <StepContent>
      <Grid container columnSpacing={2} my={2}>
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body2" fontSize={20} gutterBottom>
            {description}
          </Typography>
          <Box>
            <LearnMoreButton
              label="Learn more"
              href={DocRoute.docsExperiment()}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper
            elevation={2}
            sx={{
              p: 1,
            }}
          >
            {children}
          </Paper>
        </Grid>
      </Grid>
      {stepControl}
    </StepContent>
  );
};

const GifImage = styled(Image)({
  width: '100%',
  height: 'auto',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
  boxSizing: 'border-box',
});

const Evaluation: React.FC = () => {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const stepControllerButtons = useMemo(() => {
    return (
      <Box
        sx={{
          mt: 2,
          display: 'flex',
          gap: 2,
        }}
      >
        {activeStep === 2 ? (
          <Button size="small" onClick={handleReset}>
            Reset
          </Button>
        ) : (
          <Button size="small" variant="contained" onClick={handleNext}>
            Next
          </Button>
        )}
        {activeStep === 0 ? null : (
          <Button size="small" onClick={handleBack}>
            Back
          </Button>
        )}
      </Box>
    );
  }, [activeStep]);

  return (
    <SectionLayout
      title="Systematically Improve Performance with Experiments"
      subtitle={
        <>
          Create an <HighlightSpan>iterative loop</HighlightSpan> for your team
          to improve accuracy, latency, and the cost of your LLM application
        </>
      }
    >
      <Box
        sx={{
          px: {
            xs: 0,
            sm: 4,
          },
          mb: 8,
        }}
      >
        <Image
          width={800}
          height={517}
          style={{
            width: '100%',
            height: 'auto',
            paddingLeft: '5%',
            paddingRight: '5%',
            boxSizing: 'border-box',
          }}
          src={LifecycleDiagram}
          alt="Lifecycle Diagram"
        />
      </Box>
      <Stepper nonLinear activeStep={activeStep} orientation="vertical">
        <Step>
          <StepLabel
            index={0}
            setActiveStep={setActiveStep}
            label="Define Test Cases"
          />
          <StepSplitContent
            stepControl={stepControllerButtons}
            description="Define a set of expected behaviors for a set of inputs"
          >
            <Editor
              height="18vh"
              language="javascript"
              value={testCaseCodeSnippet}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                wordWrap: 'on',
              }}
            />
          </StepSplitContent>
        </Step>
        <Step>
          <StepLabel
            setActiveStep={setActiveStep}
            index={1}
            label="Run Evaluations"
          />
          <StepSplitContent
            stepControl={stepControllerButtons}
            description="Change / Swap models, prompts, or other components from your application layer, and run it against your test cases"
          >
            <GifImage unoptimized src={EvalGif} alt="Evaluation Gif" />
          </StepSplitContent>
        </Step>
        <Step>
          <StepLabel
            label="Analyze, Compare, and Contrast"
            index={2}
            setActiveStep={setActiveStep}
          />
          <StepSplitContent
            description="Analyze your results. Use the Notebook to perform deep dives and compare against other trials"
            stepControl={stepControllerButtons}
          >
            <GifImage
              unoptimized
              src={AnalyzeExp}
              alt="Analyze Experiments"
              width={800}
              height={517}
            />
          </StepSplitContent>
        </Step>
      </Stepper>
      <Box
        mt={2}
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      ></Box>
    </SectionLayout>
  );
};

export default Evaluation;
