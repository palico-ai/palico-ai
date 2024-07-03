import { ConversationResponse, EvalTestCase } from '@palico-ai/common';
import ChainWorkflowExecutor, {
  RunWorkflowParams,
} from '../workflows/executor';
import AgentExecutor, { AgentExecutorChatParams } from '../agent/executor';
import TestSuiteModel from '../experiments/test_case.model';
import { ResponseMetadataKey } from '../types';
import { uuid } from '../utils/common';
import { startConversationSpan } from '../tracing/internal.span';

export interface ApplicationChatParams
  extends Omit<AgentExecutorChatParams, 'conversationId' | 'requestId'> {
  conversationId?: string;
}

export class Application {
  static async chat(
    params: ApplicationChatParams
  ): Promise<ConversationResponse> {
    const conversationId = params.conversationId ?? uuid();
    const requestId = uuid();
    return await startConversationSpan(
      conversationId,
      requestId,
      'Application.chat',
      async () => {
        const startTime = performance.now();
        const response = await AgentExecutor.chat({
          ...params,
          conversationId,
          requestId,
        });
        const endTime = performance.now();
        return {
          ...response,
          metadata: {
            ...response.metadata,
            [ResponseMetadataKey.ExecutionTime]: endTime - startTime,
          },
        };
      }
    );
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
