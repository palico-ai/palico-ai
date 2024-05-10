import { PalicoApp } from '../app';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { defaultRequestAuthorizer } from './middlewares/local_authorizer';
import agentRouter from './routes/agent';
import studioRouter from './routes/studio';
import { createMetadataRoutes } from './routes/metadata';
import { defaultErrorMiddleware } from './middlewares/default_error_middeware';

export interface PalicoAPICreateParams {
  app: PalicoApp;
}

export class PalicoAPIServer {
  readonly app: PalicoApp;
  private readonly expressAPI: express.Application;
  private static instance: PalicoAPIServer;

  private constructor(params: PalicoAPICreateParams) {
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
    this.expressAPI.use('/agent', agentRouter);
    this.expressAPI.use('/studio', studioRouter);
    this.expressAPI.use('/metadata', createMetadataRoutes(this.app));
    this.expressAPI.use(defaultErrorMiddleware);
  }

  public static create(params: PalicoAPICreateParams): PalicoAPIServer {
    if (PalicoAPIServer.instance) {
      throw new Error('PalicoAPIService already created');
    }
    PalicoAPIServer.instance = new PalicoAPIServer(params);
    return PalicoAPIServer.instance;
  }

  public static getInstance(): PalicoAPIServer {
    if (!PalicoAPIServer.instance) {
      throw new Error('PalicoAPIService not created');
    }
    return PalicoAPIServer.instance;
  }

  public start(port: number) {
    this.expressAPI.listen(port, () => {
      console.log('Server started on port ' + port);
    });
  }
}
