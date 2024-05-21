import PgBoss from 'pg-boss';
import { ExperimentTestRunner, ExperimentTestRunnerData } from './workers';

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
      if (!process.env['DB_URL']) {
        throw new Error('DB_URL not set');
      }
      JobQueue._instance = new PgBoss(process.env['DB_URL']);
      JobQueue._instance.work(
        QueueName.ExprimentTestRunner,
        ExperimentTestRunner
      );
    }
    return JobQueue._instance;
  }

  static async runExperiment(data: ExperimentTestRunnerData) {
    const jobId = await JobQueue.boss().send(
      QueueName.ExprimentTestRunner,
      data
    );
    if(!jobId) {
      throw new Error('failed to start job');
    }
    return jobId;
  }
}
