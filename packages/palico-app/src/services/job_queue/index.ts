import PgBoss from 'pg-boss';
import {
  EvaluationRunnerWorkHandler,
  ScriptRunnerWorkHandler,
} from './workers';
import config from '../../config';
import { EvalCompositeKey } from '@palico-ai/common';
import { RunScriptParams } from '../../app_scripts/run_script';

export type JobQueueState = PgBoss.Worker['state'];

enum QueueName {
  EvaluationRunner = 'evaluation-runner',
  AppScriptRunner = 'app-script-runner',
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
        QueueName.EvaluationRunner,
        EvaluationRunnerWorkHandler
      );
      JobQueue._instance.work(
        QueueName.AppScriptRunner,
        ScriptRunnerWorkHandler
      );
    }
    return JobQueue._instance;
  }

  static async runExperiment(data: EvalCompositeKey) {
    const jobId = await JobQueue.boss().send(QueueName.EvaluationRunner, data);
    if (!jobId) {
      throw new Error('failed to start job');
    }
    return jobId;
  }

  static async runScript(params: RunScriptParams) {
    const jobId = await JobQueue.boss().send(QueueName.AppScriptRunner, params);
    if (!jobId) {
      throw new Error('failed to start job');
    }
    return jobId;
  }
}
