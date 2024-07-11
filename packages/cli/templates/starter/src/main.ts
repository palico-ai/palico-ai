import { PalicoAPIServer } from '@palico-ai/app';

const run = async () => {
  console.log('Running Palico API Server');
  const server = PalicoAPIServer.create({ enableDevMode: true });
  await server.start();
};

run();
