import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { defaultRequestAuthorizer } from './middlewares/local_authorizer';
import agentRouter from './routes/agent';
import studioRouter from './routes/studio';
import telemetryRouter from './routes/telemetry';
import devRouter from './routes/dev';
import metadataRouter from './routes/metadata';
import { defaultErrorMiddleware } from './middlewares/default_error_middeware';
import JobQueue from '../services/job_queue';
import config from '../config';

export interface PalicoAPICreateParams {
  enableDevMode?: boolean;
}

export class PalicoAPIServer {
  private readonly expressAPI: express.Application;
  private static instance: PalicoAPIServer;
  private enableDevMode = false;

  private constructor(params: PalicoAPICreateParams) {
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
    this.expressAPI.route('/health').get((_, res) => {
      return res.status(200).json({ status: 'UP' });
    });
    this.expressAPI.use('/agent', agentRouter);
    this.expressAPI.use('/studio', studioRouter);
    this.expressAPI.use('/telemetry', telemetryRouter);
    this.expressAPI.use('/metadata', metadataRouter);
    // this.expressAPI.use('/workflow', workflowRouter);
    if (params.enableDevMode) {
      this.enableDevMode = true;
      this.expressAPI.use('/dev', devRouter);
    }
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

  public async start() {
    if (this.enableDevMode) {
      await JobQueue.start();
    }
    const port = config.getAPIPort();
    this.expressAPI.listen(port, () => {
      console.log('Server started on port ' + port);
    });
  }
}
