import { AgentResponse } from '@palico-ai/common';

export interface StreamContentDelta {
  message?: string;
  data?: any;
  done?: boolean;
}

export interface StreamContent {
  conversationId: string;
  requestId: string;
  delta: StreamContentDelta;
  done: boolean;
}

export interface ChatResponseStreamOptions {
  onPush?: (content: StreamContent) => void;
}

export class ChatResponseStream {
  conversationId: string;
  requestId: string;
  chunks: StreamContentDelta[] = [];

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
  push(chunk: StreamContentDelta) {
    if (this.onPush) {
      this.onPush({
        conversationId: this.conversationId,
        requestId: this.requestId,
        delta: chunk,
        done: false,
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
