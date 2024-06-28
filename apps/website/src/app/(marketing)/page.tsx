import { Container, Divider } from '@mui/material';
import LandingPageHeader from './__shared__/header';
import EvidenceSection from './__shared__/evidence';
import ApplicationAttributes from './__shared__/attributes';
import BuildModularApp from './__v2__/build_app';
import ExperimentSection from './__v2__/experiment';
import DeployAndIntegrate from './__v2__/deploy';
import LearnMore from './__shared__/learn_more';
import ControlPanel from './__v2__/control_panel';

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
      <EvidenceSection />
      <ApplicationAttributes />
      <BuildModularApp />
      <ExperimentSection />
      <DeployAndIntegrate />
      <ControlPanel />
      <Divider sx={{ my: 8 }} />
      <LearnMore />
      {/* <FrameworkComponents /> */}
      {/* <InceptionToProduction /> */}
    </Container>
  );
}
