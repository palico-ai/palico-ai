import { AgentResponse, ConversationResponse } from '@palico-ai/common';
import { AgentExecutor, AgentExecutorChatParams } from '../agent/executor';
import ChainWorkflowExecutor, {
  RunWorkflowParams,
} from '../workflows/executor';
import DatasetModel from '../models/datasets';


export class Application {
  static async chat(params: AgentExecutorChatParams): Promise<AgentResponse> {
    const response = await AgentExecutor.chat(params);
    return response;
  }

  static async runWorkflow(params: RunWorkflowParams): Promise<ConversationResponse> {
    const result = await ChainWorkflowExecutor.run(params);
    return result;
  }

  static async fetchDataset<T>(name: string): Promise<T[]> {
    const datasetFetcher = await DatasetModel.getDatasetByName<T>(name);
    const dataset = await datasetFetcher.fetch();
    return dataset;
  }
}
