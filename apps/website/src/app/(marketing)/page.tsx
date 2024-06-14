import { Container, Divider } from '@mui/material';
import LandingPageHeader from './__sections__/header';
import ApplicationAttributes from './__sections__/attributes';
import HowItWorks from './__sections__/how_it_works';
import LearnMore from './__sections__/learn_more';
import FrameworkComponents from './__sections__/prototype_to_prod';

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
      <HowItWorks />
      <FrameworkComponents />
      {/* <InceptionToProduction /> */}
      <Divider sx={{ my: 8 }} />
      <LearnMore />
    </Container>
  );
}
