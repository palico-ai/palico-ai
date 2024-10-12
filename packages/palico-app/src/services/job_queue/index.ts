import PgBoss from 'pg-boss';
import {
  ExperimentTestQueueWorkHandler,
  WorkflowRunnerQueueWorkHandler,
} from './workers';
import config from '../../config';
import { EvalCompositeKey } from '@palico-ai/common';
import { ApplicationWorkflowParams } from '../../app/types';
import { uuid } from '../../utils/common';

enum QueueName {
  ExprimentTestRunner = 'experiment-test-runner',
  WorkflowRequestRunner = 'workflow-request-runner',
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
        ExperimentTestQueueWorkHandler
      );
      JobQueue._instance.work(
        QueueName.WorkflowRequestRunner,
        WorkflowRunnerQueueWorkHandler
      );
    }
    return JobQueue._instance;
  }

  static async runExperiment(data: EvalCompositeKey) {
    const jobId = await JobQueue.boss().send(
      QueueName.ExprimentTestRunner,
      data
    );
    if (!jobId) {
      throw new Error('failed to start job');
    }
    return jobId;
  }

  static async runWorkflow(params: ApplicationWorkflowParams) {
    const requestId = params.requestId ?? uuid();
    const jobId = await JobQueue.boss().send(QueueName.WorkflowRequestRunner, {
      ...params,
      requestId,
    });
    if (!jobId) {
      throw new Error('failed to start job');
    }
    return { requestId };
  }
}
