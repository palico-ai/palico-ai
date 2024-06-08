import './instrumentation';
import { PalicoAPIServer } from '@palico-ai/app';

const run = async () => {
  const server = PalicoAPIServer.create({ enableDevMode: true });
  await server.start();
};

run();
