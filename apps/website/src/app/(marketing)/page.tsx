import { Container, Divider } from '@mui/material';
import LearnMore from './__components__/learn_more/learn_more';
import LandingPageHeader from './__components__/header';
import Integrations from './__components__/integrations';
import PalicoStudio from './__components__/palico_studio';
import Evaluation from './__components__/evaluation';
import AppConfigHotSwap from './__components__/hot_swap';
import GettingStartedFragment from './__components__/getting_started';

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
      <Integrations />
      <AppConfigHotSwap />
      <Evaluation />
      <PalicoStudio />
      <GettingStartedFragment />
      <Divider sx={{ my: 8 }} />
      <LearnMore />
    </Container>
  );
}
