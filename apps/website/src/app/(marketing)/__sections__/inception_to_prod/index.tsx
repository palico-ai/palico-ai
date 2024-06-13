import React from 'react';
import SectionLayout from '../section_layout';
import { Box, Grid } from '@mui/material';
import SimpleValuePropCard from './value_prop_card';
import UseCases from './use_cases';
import AnIntegratedDevelopmentStack from './integrated_tech_stack';
import PrototypeAndIterate from './prototype';
import { LandingPageData } from '../../data';

const SimpleValueProps = [
  {
    label: 'Replace Vibe-Check with Data Driven Decisions',
    description: 'Prototype and iterate quickly',
  },
  {
    label: 'Demystify Evaluation and Accuracy Testing',
    description: 'Demystify Accuracy Evaluation',
  },
  {
    label: 'Collaborate with your team',
    description: 'Use-Cases and Applications',
  },
];

const InceptionToProduction: React.FC = () => {
  return (
    <SectionLayout
      alignTitle={'center'}
      title={LandingPageData.protoToProd.title}
    >
      <Box>
        <Grid container spacing={4} columnSpacing={12}>
          <Grid item xs={12} md={6}>
            <AnIntegratedDevelopmentStack />
          </Grid>
          <Grid item xs={12} md={6}>
            <UseCases />
          </Grid>
          <Grid item xs={12} my={4}>
            <PrototypeAndIterate />
          </Grid>
        </Grid>
        <Grid container spacing={4} columnSpacing={12} sx={{ mt: 8 }}>
          {SimpleValueProps.map((valueProp, index) => (
            <Grid item xs={12} key={index}>
              <SimpleValuePropCard {...valueProp} label={valueProp.label}>
                {valueProp.description}
              </SimpleValuePropCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </SectionLayout>
  );
};

export default InceptionToProduction;
