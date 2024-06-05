import { ConversationResponse, ExperimentTestCaseDataset } from '@palico-ai/common';
import ChainWorkflowExecutor, {
  RunWorkflowParams,
} from '../workflows/executor';
import AgentExecutor, { AgentExecutorChatParams } from '../agent/executor';
import TestCaseDatasetModel from '../experiments/test_case.model';

export class Application {
  static async chat(params: AgentExecutorChatParams): Promise<ConversationResponse> {
    const response = await AgentExecutor.chat(params);
    return response;
  }

  static async runWorkflow(
    params: RunWorkflowParams
  ): Promise<ConversationResponse> {
    const result = await ChainWorkflowExecutor.run(params);
    return result;
  }

  static async fetchTestDataset(name: string): Promise<ExperimentTestCaseDataset[]> {
    const dataset = await TestCaseDatasetModel.findByName(name);
    return dataset;
  }
}
