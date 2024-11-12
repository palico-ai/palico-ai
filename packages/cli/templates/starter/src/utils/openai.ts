import OpenAI from 'openai';

export const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  return client;
};
