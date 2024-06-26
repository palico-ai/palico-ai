import {
  ConversationResponse,
  EvalJobKeyID,
  CreateEvaluationParams,
  CreateEvalJobResponse,
  EvalTestCase,
  EvalJSON,
  EvalJobStatus,
  EvalResult,
  EvalMetricOutput,
  AppConfig,
} from '@palico-ai/common';
import { Application } from '../app';
import JobQueue from '../services/job_queue';
import ExperimentModel from './model';

interface RunTestCaseParams {
  testCase: EvalTestCase;
  appConfig?: AppConfig;
  agentName?: string;
  workflowName?: string;
}

export class ExperimentExecutor {
  static async startTestJob(
    params: CreateEvaluationParams
  ): Promise<CreateEvalJobResponse> {
    const { eval: test } = await ExperimentModel.createEvalJobConfig(params);
    // TODO: Move run experiment to here
    const jobId = await JobQueue.runExperiment({
      experimentName: test.experimentName,
      evalName: test.evalName,
    });
    return {
      jobId,
      evalName: test,
    };
  }

  static async runEvaluation(key: EvalJobKeyID): Promise<EvalJSON> {
    try {
      let test = await ExperimentModel.updateTestJSON(key, {
        status: {
          state: EvalJobStatus.ACTIVE,
        },
      });
      const dataset = await Application.fetchTestDataset(test.testSuiteName);
      const results = await Promise.all(
        dataset.map((testCase) =>
          ExperimentExecutor.runTestCase({
            testCase,
            agentName: test.agentName,
            workflowName: test.workflowName,
            appConfig: test.appConfig,
          })
        )
      );
      test = await ExperimentModel.updateTestJSON(key, {
        status: {
          state: EvalJobStatus.SUCCESS,
        },
      });
      await ExperimentModel.updateTestResultJSON(key, {
        result: results,
      });
      return test;
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      await ExperimentModel.updateTestJSON(key, {
        status: {
          state: EvalJobStatus.FAILED,
          message,
        },
      });
      throw error;
    }
  }

  private static runTestCase = async (
    params: RunTestCaseParams
  ): Promise<EvalResult> => {
    const { testCase, agentName, workflowName, appConfig } = params;
    let response: ConversationResponse;
    if (agentName) {
      response = await Application.chat({
        agentName,
        content: testCase.input,
        appConfig,
      });
    } else if (workflowName) {
      response = await Application.executeWorkflow({
        workflowName,
        content: testCase.input,
        appConfig,
      });
    } else {
      throw new Error('Either agentName or workflowName is required');
    }
    const metrics = await Promise.all(
      testCase.metrics.map(async (metric) => {
        const result = await metric.evaluate(testCase.input, response);
        return {
          name: metric.label,
          value: result,
        };
      })
    );
    const metricsReport: Record<string, EvalMetricOutput> = {};
    metrics.forEach((metric) => {
      metricsReport[metric.name] = metric.value;
    });
    return {
      input: testCase.input,
      tags: testCase.tags,
      output: response,
      metrics: metricsReport,
    };
  };
}
