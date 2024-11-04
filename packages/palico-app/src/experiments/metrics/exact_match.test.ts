import { exactMatchEvalMetric, ExactMatchParams } from './exact_match';
import { AgentRequestContent } from '@palico-ai/common';
import {
  mockAgentRequestContent,
  mockAgentResponse,
} from '../../test_utils/mock_agent';

describe('ExactMatchMetric', () => {
  it('should return 1 when the response is an exact match', async () => {
    const expected: ExactMatchParams = {
      expected: {
        message: 'expected message',
        data: { key: 'value' },
      },
    };
    const metric = exactMatchEvalMetric(expected);

    const matchingAgentResponse = mockAgentResponse({
      message: 'expected message',
      data: { key: 'value' },
    });

    const result = await metric.evaluate(
      mockAgentRequestContent(),
      matchingAgentResponse
    );
    expect(result.score).toBe(1);
  });

  it('should return 0 when the response message does not match', async () => {
    const expected: ExactMatchParams = {
      expected: {
        message: 'expected message',
        data: { key: 'value' },
      },
    };
    const metric = exactMatchEvalMetric(expected);
    const wrongResponse = mockAgentResponse({
      message: 'different message',
      data: { key: 'value' },
    });
    const result = await metric.evaluate(
      mockAgentRequestContent(),
      wrongResponse
    );
    expect(result.score).toBe(0);
  });

  it('should return 0 when the response data does not match', async () => {
    const params: ExactMatchParams = {
      expected: {
        message: 'expected message',
        data: { key: 'value' },
      },
    };

    const metric = exactMatchEvalMetric(params);

    const response = mockAgentResponse({
      message: 'expected message',
      data: { key: 'different value' },
    });

    const result = await metric.evaluate({} as AgentRequestContent, response);
    expect(result.score).toBe(0);
  });
});
