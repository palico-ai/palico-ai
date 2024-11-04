import {
  AgentResponse,
  EvalCompositeKey,
  CreateEvaluationParams,
  CreateEvalJobResponse,
  EvalTestCase,
  EvalJSON,
  JobQueueStatus,
  EvalTestCaseResult,
  EvalMetricOutput,
  JSONAbleObject,
} from '@palico-ai/common';
import JobQueue from '../services/job_queue';
import ExperimentModel from './model';
import { ResponseMetadataKey } from '../types';
import { Agent } from '../agent';
import TestSuiteModel from './test_suite/model';

interface RunTestCaseParams {
  testCase: EvalTestCase;
  appConfig?: JSONAbleObject;
  agentName?: string;
  workflowName?: string;
}

interface MetadataSystemMetric {
  label: string;
  metatadataKey: ResponseMetadataKey;
}

const SYSTEM_METRICS: MetadataSystemMetric[] = [
  {
    label: 'Execution Time',
    metatadataKey: ResponseMetadataKey.ExecutionTime,
  },
  {
    label: 'Total Tokens',
    metatadataKey: ResponseMetadataKey.TotalTokens,
  },
  {
    label: 'Input Tokens',
    metatadataKey: ResponseMetadataKey.InputTokens,
  },
  {
    label: 'Output Tokens',
    metatadataKey: ResponseMetadataKey.OutputTokens,
  },
  {
    label: 'Total Cost',
    metatadataKey: ResponseMetadataKey.TotalCost,
  },
];

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

  static async runEvaluation(key: EvalCompositeKey): Promise<EvalJSON> {
    try {
      let test = await ExperimentModel.updateTestJSON(key, {
        status: {
          state: JobQueueStatus.ACTIVE,
        },
      });
      const dataset = await TestSuiteModel.findByName(test.testSuiteName);
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
          state: JobQueueStatus.SUCCESS,
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
          state: JobQueueStatus.FAILED,
          message,
        },
      });
      throw error;
    }
  }

  private static runTestCase = async (
    params: RunTestCaseParams
  ): Promise<EvalTestCaseResult> => {
    const { testCase, agentName, workflowName, appConfig } = params;
    let response: AgentResponse;
    if (agentName) {
      response = await Agent.chat({
        agentName,
        userMessage: testCase.input.userMessage,
        payload: testCase.input.payload,
        toolCallResults: testCase.input.toolCallResults,
        appConfig: appConfig ?? {},
      });
    } else if (workflowName) {
      throw new Error('Workflow execution is not supported yet');
    } else {
      throw new Error('Agent name required');
    }
    const metrics = await Promise.all(
      testCase.metrics.map(async (metric) => {
        try {
          const result = await metric.evaluate(testCase.input, response);
          return {
            name: metric.label,
            value: result,
          };
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          return {
            name: metric.label,
            value: {
              score: 0,
              errorMessage,
            },
          };
        }
      })
    );
    SYSTEM_METRICS.forEach((metric) => {
      const score = response.metadata?.[metric.metatadataKey];
      if (score !== undefined) {
        metrics.push({
          name: metric.label,
          value: {
            score,
          },
        });
      }
    });
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
