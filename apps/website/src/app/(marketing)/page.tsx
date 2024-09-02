import { Container, Divider } from '@mui/material';
import ApplicationAttributes from './__components__/attributes';
import LearnMore from './__components__/learn_more/learn_more';
import LandingPageHeader from './__components__/header';
import BuildAnyApplicationFragment from './__components__/build_any_application';
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
      <ApplicationAttributes />
      <BuildAnyApplicationFragment />
      <AppConfigHotSwap />
      <PalicoStudio />
      <Evaluation />
      <GettingStartedFragment />
      <Divider sx={{ my: 8 }} />
      <LearnMore />
    </Container>
  );
}
