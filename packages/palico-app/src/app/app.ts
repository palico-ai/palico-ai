import { ConversationResponse, EvalTestCase } from '@palico-ai/common';
import ChainWorkflowExecutor, {
  RunWorkflowParams,
} from '../workflows/executor';
import AgentExecutor, { AgentExecutorChatParams } from '../agent/executor';
import TestSuiteModel from '../experiments/test_case.model';
import { ResponseMetadataKey } from '../types';

export class Application {
  static async chat(
    params: AgentExecutorChatParams
  ): Promise<ConversationResponse> {
    const startTime = performance.now();
    const response = await AgentExecutor.chat(params);
    const endTime = performance.now();
    return {
      ...response,
      metadata: {
        ...response.metadata,
        [ResponseMetadataKey.ExecutionTime]: endTime - startTime,
      },
    };
  }

  static async executeWorkflow(
    params: RunWorkflowParams
  ): Promise<ConversationResponse> {
    const result = await ChainWorkflowExecutor.execute(params);
    return result;
  }

  static async fetchTestDataset(name: string): Promise<EvalTestCase[]> {
    const dataset = await TestSuiteModel.findByName(name);
    return dataset;
  }
}
