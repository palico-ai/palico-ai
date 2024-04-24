import { PalicoAPI } from '@palico-ai/app';
import app from './app';

const PORT = 8000

const runner = () => {
  const palicoAPI = new PalicoAPI({ app });
  console.log("Routes")
  console.log(palicoAPI.expressAPI._router.stack)
  palicoAPI.expressAPI.listen(PORT, () => {
    console.log('Server started on port ' + PORT);
  });
};

void runner();