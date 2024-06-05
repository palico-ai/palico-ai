import { Container } from '@mui/material';
import LandingPageHeader from './__sections__/header';
import ApplicationAttributes from './__sections__/attributes';
import HowItWorks from './__sections__/how_it_works';
import InceptionToProduction from './__sections__/inception_to_prod';
import LearnMore from './__sections__/learn_more';

export default function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */
  return (
    <Container
      maxWidth="lg"
      sx={{
        mb: 16,
      }}
    >
      <LandingPageHeader />
      <ApplicationAttributes />
      <HowItWorks />
      <InceptionToProduction />
      <LearnMore />
    </Container>
  );
}
