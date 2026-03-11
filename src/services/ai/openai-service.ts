import { createOpenAI } from '@ai-sdk/openai';

// Singleton OpenAI provider via Vercel AI SDK
export const openaiProvider = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? '',
});

export const gpt4o = openaiProvider('gpt-4o');
export const gpt4oMini = openaiProvider('gpt-4o-mini');
