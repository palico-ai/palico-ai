import { Container, Divider } from '@mui/material';
import LandingPageHeader from '../__shared__/header';
import HowItWorks from './experiments';
import LearnMore from '../__shared__/learn_more';
import EvidenceSection from '../__shared__/evidence';
import ApplicationAttributes from '../__shared__/attributes';

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
      <HowItWorks />
      {/* <FrameworkComponents /> */}
      {/* <InceptionToProduction /> */}
      <Divider sx={{ my: 8 }} />
      <LearnMore />
    </Container>
  );
}
