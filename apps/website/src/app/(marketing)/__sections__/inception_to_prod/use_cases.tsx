import { Box } from '@mui/material';
import { AccordionList, Typography } from '@palico-ai/components';
import { LandingPageData } from '../../data';

const UseCases: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" mb={4}>
        {LandingPageData.protoToProd.sections.useCases.title}
      </Typography>
      <Typography variant="subtitle2" mb={2}>
        {LandingPageData.protoToProd.sections.useCases.description}
      </Typography>
      <Box>
        <AccordionList
          items={LandingPageData.protoToProd.sections.useCases.items}
        />
      </Box>
    </Box>
  );
};

export default UseCases;
