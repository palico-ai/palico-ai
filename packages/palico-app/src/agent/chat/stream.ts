import {
  AgentResponse,
  AgentResponseChunk,
  AgentResponseChunkDelta,
} from '@palico-ai/common';

export interface ChatResponseStreamOptions {
  onPush?: (content: AgentResponseChunk) => void;
}

export class ChatResponseStream {
  conversationId: string;
  requestId: string;
  chunks: AgentResponseChunkDelta[] = [];

  private onPush?: ChatResponseStreamOptions['onPush'];

  constructor(
    conversationId: string,
    requestId: string,
    options?: ChatResponseStreamOptions
  ) {
    this.conversationId = conversationId;
    this.requestId = requestId;
    this.onPush = options?.onPush;
  }

  /**
   * Push new content to the stream
   * @param chunk - The content to push to the stream
   */
  push(chunk: AgentResponseChunkDelta) {
    if (this.onPush) {
      this.onPush({
        conversationId: this.conversationId,
        requestId: this.requestId,
        delta: chunk,
      });
    }
    this.chunks.push(chunk);
  }

  async resolveContent(): Promise<AgentResponse> {
    if (this.chunks.length === 0) {
      throw new Error('No content');
    }
    const response: AgentResponse = {
      conversationId: this.conversationId,
      requestId: this.requestId,
      message: '',
      data: {},
    };
    for (const chunk of this.chunks) {
      if (chunk.message) {
        response.message += chunk.message;
      }
      response.data = { ...response.data, ...chunk.data };
    }
    return response;
  }
}
