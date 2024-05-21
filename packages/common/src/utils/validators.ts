import { z } from "zod";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const ConversationResponseSchema = z.object({
  message: z.string(),
  data: z.any(),
});

export const ConversationRequestContentSchema = z.object({
  userMessage: z.string(),
  payload: z.any(),
});

export const validate = <T>(schema: z.ZodType<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(error.errors.map(e => e.message).join(', '));
    }
    throw error;
  }
}