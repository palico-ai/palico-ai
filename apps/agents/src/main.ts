import './instrumentation';
import { PalicoAPIServer } from '@palico-ai/app';
import app from './app';
const PORT = 8000;

const server = PalicoAPIServer.create({ app });
server.start(PORT);
