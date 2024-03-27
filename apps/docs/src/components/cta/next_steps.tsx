import { Grid } from "@mui/material";
import React, { useMemo } from "react";
import { SimpleCard } from "../card";

interface NextStepCTAStepProp {
  title: string;
  description: string;
  link: string;
}

interface NextStepCTAProps {
  steps: NextStepCTAStepProp[];
}

const NextStepsCTA: React.FC<NextStepCTAProps> = ({ steps }) => {
  const mdSpacing = useMemo(() => {
    if (steps.length === 1) {
      return 12;
    }
    if (steps.length === 2) {
      return 6;
    }
    return 4;
  }, [steps])

  return (
    <Grid container spacing={2}>
      {steps.map((step, index) => (
        <Grid item xs={12} md={mdSpacing} key={index}>
          <SimpleCard
            fullHeight
            title={step.title}
            description={step.description}
            link={step.link}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default NextStepsCTA;
