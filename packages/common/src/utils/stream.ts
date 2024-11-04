import { AgentResponse, AgentResponseChunk } from '../types';
import { merge } from 'lodash';

/**
 * Utility class to read chunks from an agent response stream.
 */
export class AgentResponseStreamReader {
  chunks: AgentResponseChunk[];
  response: Response;

  constructor(response: Response) {
    this.chunks = [];
    this.response = response;
  }

  /**
   * Read chunks from the stream over an iterator.
   * @returns An async iterator that yields chunks that can be looped over.
   */
  async *readChunks(): AsyncIterableIterator<AgentResponseChunk> {
    const reader = this.response.body?.getReader();
    if (!reader) {
      throw new Error('Reader is not defined');
    }
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let done = false;
    while (!done) {
      const { value, done: readerDone } = await reader.read();
      if (readerDone) {
        done = true;
        break;
      }
      if (!value) {
        continue;
      }
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split('\n');
      buffer = parts.pop() || '';
      for (const part of parts) {
        const chunk = JSON.parse(part);
        this.chunks.push(chunk);
        yield chunk;
      }
    }
    if (buffer) {
      const chunk = JSON.parse(buffer);
      this.chunks.push(chunk);
      yield chunk;
    }
  }

  /**
   * Merge the current merged chunks into a single response.
   * @returns The merged chunks as a single response.
   */
  getMergedChunks(): AgentResponse {
    return AgentResponseStreamReader.mergeChunks(this.chunks);
  }

  static mergeChunks(chunks: AgentResponseChunk[]): AgentResponse {
    if (chunks.length === 0) {
      throw new Error('No chunks to merge');
    }
    const merged: AgentResponse = {
      conversationId: chunks[0].conversationId,
      requestId: chunks[0].requestId,
      message: undefined,
      data: undefined,
      toolCalls: undefined,
      intermediateSteps: undefined,
    };
    for (const chunk of chunks) {
      if (chunk.delta.message) {
        if (!merged.message) {
          merged.message = '';
        }
        merged.message += chunk.delta.message;
      }
      if (chunk.delta.data) {
        if (!merged.data) {
          merged.data = {};
        }
        merged.data = merge(merged.data, chunk.delta.data);
      }
      if (chunk.delta.toolCalls) {
        if (!merged.toolCalls) {
          merged.toolCalls = [];
        }
        merged.toolCalls.push(...chunk.delta.toolCalls);
      }
      if (chunk.delta.intermediateSteps) {
        if (!merged.intermediateSteps) {
          merged.intermediateSteps = [];
        }
        merged.intermediateSteps.push(...chunk.delta.intermediateSteps);
      }
    }
    return merged;
  }
}
