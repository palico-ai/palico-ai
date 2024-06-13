import { Box } from '@mui/material';
import { Typography } from '@palico-ai/components';
import React from 'react';
import { LandingPageData } from '../../data';

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
        {LandingPageData.protoToProd.sections.techStack.title}
      </Typography>
      <Box>
        {LandingPageData.protoToProd.sections.techStack.items.map(
          (techStackItem, index) => (
            <TechStackItem key={index} {...techStackItem} />
          )
        )}
      </Box>
    </Box>
  );
};

export default AnIntegratedDevelopmentStack;
