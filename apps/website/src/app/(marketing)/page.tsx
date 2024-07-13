import { Container, Divider } from '@mui/material';
import ApplicationAttributes from './__components__/attributes';
import BuildModularApp from './__components__/build_app';
import ExperimentSection from './__components__/experiment';
import DeployAndIntegrate from './__components__/deploy';
import LearnMore from './__components__/learn_more/learn_more';
import LandingPageHeader from './__components__/header';

export default function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */
  return (
    <Container
      maxWidth="xl"
      sx={{
        mb: 16,
      }}
    >
      <LandingPageHeader />
      <ApplicationAttributes />
      <BuildModularApp />
      <ExperimentSection />
      <DeployAndIntegrate />
      <Divider sx={{ my: 8 }} />
      <LearnMore />
    </Container>
  );
}
