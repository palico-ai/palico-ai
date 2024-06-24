import PgBoss from 'pg-boss';
import { ExperimentTestRunner } from './workers';
import config from '../../config';
import { EvalJobKeyID } from '@palico-ai/common';

export type JobQueueState = PgBoss.Worker['state'];

enum QueueName {
  ExprimentTestRunner = 'experiment-test-runner',
}

export default class JobQueue {
  private static _instance: PgBoss;
  private static _started = false;

  static async start() {
    if (JobQueue._started) {
      return;
    }
    const boss = JobQueue.boss();
    await boss.start();
    JobQueue._started = true;
  }

  static boss() {
    if (!JobQueue._instance) {
      const dbURL = config.getDBUrl();
      if (!dbURL) {
        throw new Error('Missing SQL Database URL');
      }
      JobQueue._instance = new PgBoss(dbURL);
      JobQueue._instance.work(
        QueueName.ExprimentTestRunner,
        ExperimentTestRunner
      );
    }
    return JobQueue._instance;
  }

  static async runExperiment(data: EvalJobKeyID) {
    const jobId = await JobQueue.boss().send(
      QueueName.ExprimentTestRunner,
      data
    );
    if (!jobId) {
      throw new Error('failed to start job');
    }
    return jobId;
  }
}
