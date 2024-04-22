import { PalicoApp } from '../app';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { defaultRequestAuthorizer } from './middlewares/local_authorizer';
import { createAgentConversationRouter } from './routes/conversation';
import { createMetadataRoutes } from './routes/metadata';

export interface PalicoAPICreateParams {
  app: PalicoApp;
}

export class PalicoAPI {
  private app: PalicoApp;
  readonly expressAPI: express.Application;

  constructor(params: PalicoAPICreateParams) {
    this.app = params.app;
    this.expressAPI = express();
    this.expressAPI.use(cors());
    this.expressAPI.use(bodyParser.json());
    this.expressAPI.use(function (_, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    });
    this.expressAPI.use(defaultRequestAuthorizer);
    this.expressAPI.route('/').get((_, res) => {
      res.send('Palico API is running');
    });
    this.buildAgentRoutes();
    this.expressAPI.use("/metadata", createMetadataRoutes(this.app))
  }

  private buildAgentRoutes() {
    this.app.agents.forEach((item) => {
      const agentRoute = item.id.startsWith('/')
        ? item.id.slice(1)
        : item.id;

      this.expressAPI.use(
        `/agent/${agentRoute}`,
        createAgentConversationRouter(item.agent)
      );
    });
  }
}
