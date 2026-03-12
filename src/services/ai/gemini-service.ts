import { createGoogleGenerativeAI } from '@ai-sdk/google';

export const googleProvider = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? '',
});

// gemini-2.5-flash-lite: chat libre, streaming — $0.10/M input
// ⚠️ NE PAS utiliser avec generateObject (bug structured outputs)
export const geminiFlashLite = googleProvider('gemini-2.5-flash-lite-preview-06-17');

// Fallback vers gpt-4o-mini si Gemini indisponible
export const GEMINI_FLASH_LITE_ID = 'gemini-2.5-flash-lite-preview-06-17';
