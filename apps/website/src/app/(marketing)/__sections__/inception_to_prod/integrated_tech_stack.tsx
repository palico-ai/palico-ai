import { Box } from '@mui/material';
import { Typography } from '@palico-ai/components';
import React from 'react';

interface TechStackItemProps {
  label: string;
  description: string;
}

const TechStackItem: React.FC<TechStackItemProps> = ({
  label,
  description,
}) => {
  return (
    <Box mb={4}>
      <Typography gutterBottom variant="h5" fontWeight={'regular'}>
        {label}
      </Typography>
      <Typography variant="body2">{description}</Typography>
    </Box>
  );
};

const AnIntegratedDevelopmentStack: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" mb={4}>
        Start with a flexible set of integrated tools
      </Typography>
      <Box>
        <TechStackItem
          label="Agent API and SDK"
          description="Easily define any LLM components and automatically depoy them as a RESTful API."
        />
        <TechStackItem
          label="Workflows"
          description="Organize and combine multiple LLM components, business logics, and their interactions into a single workflow."
        />
        <TechStackItem
          label="Observability"
          description="Organize and combine multiple LLM components, business logics, and their interactions into a single workflow."
        />
        <TechStackItem
          label="Experimentation"
          description="Organize and combine multiple LLM components, business logics, and their interactions into a single workflow."
        />
        <TechStackItem
          label="Dashboard UI"
          description="Organize and combine multiple LLM components, business logics, and their interactions into a single workflow."
        />
      </Box>
    </Box>
  );
};

export default AnIntegratedDevelopmentStack;
