import { AgentResponse, AgentResponseChunk } from '@palico-ai/common';
import { merge } from 'lodash';

export const streamIterator = async function* <Chunk = any>(
  reader: ReadableStreamDefaultReader<Uint8Array>
): AsyncIterableIterator<Chunk> {
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
      yield JSON.parse(part);
    }
  }
  if (buffer) {
    yield JSON.parse(buffer);
  }
};

export const mergeAgentResponseChunk = (
  chunks: AgentResponseChunk[]
): AgentResponse => {
  if (chunks.length === 0) {
    throw new Error('No chunks to merge');
  }
  const merged: AgentResponse = {
    conversationId: chunks[0].conversationId,
    requestId: chunks[0].requestId,
    message: '',
    data: {},
  };
  for (const chunk of chunks) {
    if (chunk.delta.message) {
      merged.message += chunk.delta.message;
    }
    if (chunk.delta.data) {
      merged.data = merge(merged.data, chunk.delta.data);
    }
  }
  return merged;
};
