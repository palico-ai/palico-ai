import { ConversationResponse, ExperimentTestKeyID } from '@palico-ai/common';
import { Application } from '../app';
import JobQueue from '../services/job_queue';
import ExperimentModel from './model';
import {
  CreateExperimentTestParams,
  CreateNewExperimentTestResult,
  EvalMetricOutput,
  ExperimentTestCaseDataset,
  ExperimentTestCaseResult,
  ExperimentTestJSON,
  ExperimentTestStatus,
} from './types';

interface RunTestCaseParams {
  testCase: ExperimentTestCaseDataset;
  featureFlags?: Record<string, unknown>;
  agentName?: string;
  workflowName?: string;
}

export class ExperimentExecutor {
  static async startTestJob(
    params: CreateExperimentTestParams
  ): Promise<CreateNewExperimentTestResult> {
    const { test } = await ExperimentModel.createTest(params);
    // TODO: Move run experiment to here
    const jobId = await JobQueue.runExperiment({ 
      experimentName: test.experimentName,
      testName: test.testName,
     });
    return {
      jobId,
      test,
    };
  }

  static async runTest(testKey: ExperimentTestKeyID): Promise<ExperimentTestJSON> {
    try {
      let test = await ExperimentModel.updateTestJSON(testKey, {
        status: {
          state: ExperimentTestStatus.ACTIVE,
        },
      });
      const dataset = await Application.fetchTestDataset(
        test.testCaseDatasetName
      );
      const results = await Promise.all(
        dataset.map((testCase) =>
          ExperimentExecutor.runTestCase({
            testCase,
            agentName: test.agentName,
            workflowName: test.workflowName,
            featureFlags: test.featureFlags,
          })
        )
      );
      test = await ExperimentModel.updateTestJSON(testKey, {
        status: {
          state: ExperimentTestStatus.SUCCESS,
        },
      });
      await ExperimentModel.updateTestResultJSON(testKey, {
        result: results,
      });
      return test;
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      await ExperimentModel.updateTestJSON(testKey, {
        status: {
          state: ExperimentTestStatus.FAILED,
          message,
        },
      });
      throw error;
    }
  }

  private static runTestCase = async (
    params: RunTestCaseParams
  ): Promise<ExperimentTestCaseResult> => {
    const { testCase, agentName, workflowName, featureFlags } = params;
    let response: ConversationResponse;
    if (agentName) {
      response = await Application.chat({
        agentName,
        content: testCase.input,
        featureFlags,
      });
    } else if (workflowName) {
      response = await Application.runWorkflow({
        workflowName,
        content: testCase.input,
        featureFlags,
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
