import { type ErrorRequestHandler } from 'express';
import { APIError } from '../error';
import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer('conversation-router');

export const defaultErrorMiddleware: ErrorRequestHandler = (
  err,
  _,
  res,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  __
) => {
  tracer.startActiveSpan('defaultErrorMiddleware', (span) => {
    console.log('Error:', err);
    if (!(err instanceof Error)) {
      span.end();
      return res.status(500).json({ error: 'An unknown error occurred' });
    }
    // === Known error types ===
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    if (err instanceof APIError) {
      span.addEvent('APIError', {
        statusCode: err.statusCode,
        message: err.message,
      });
      span.end();
      return res.status(err.statusCode).json({ error: err.message });
    } else {
      span.addEvent('Default Error', { message: errorMessage });
      span.end();
      return res.status(500).json({ error: err.message });
    }
  });
};
