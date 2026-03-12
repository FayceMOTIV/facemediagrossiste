// Langfuse observability - logs all AI calls
// Only active when LANGFUSE_PUBLIC_KEY and LANGFUSE_SECRET_KEY are set

interface LangfuseTrace {
  generation: (options: Record<string, unknown>) => void;
}

interface LangfuseInstance {
  trace: (options: { name: string; userId?: string; metadata?: Record<string, unknown>; input?: unknown }) => LangfuseTrace;
  flushAsync: () => Promise<void>;
}

let langfuseInstance: LangfuseInstance | null = null;

async function getLangfuse(): Promise<LangfuseInstance | null> {
  if (langfuseInstance) return langfuseInstance;

  const publicKey = process.env.LANGFUSE_PUBLIC_KEY;
  const secretKey = process.env.LANGFUSE_SECRET_KEY;

  if (!publicKey || !secretKey) return null;

  try {
    const { Langfuse } = await import('langfuse');
    langfuseInstance = new Langfuse({
      publicKey,
      secretKey,
      baseUrl: process.env.LANGFUSE_BASE_URL ?? 'https://cloud.langfuse.com',
    }) as unknown as LangfuseInstance;
    return langfuseInstance;
  } catch {
    return null;
  }
}

export interface TraceOptions {
  name: string;
  userId?: string;
  metadata?: Record<string, unknown>;
  input?: unknown;
}

export async function createTrace(options: TraceOptions) {
  const lf = await getLangfuse();
  if (!lf) return null;
  return lf.trace({
    name: options.name,
    userId: options.userId,
    metadata: options.metadata,
    input: options.input,
  });
}

export async function logAICall(
  traceName: string,
  model: string,
  prompt: string,
  completion: string,
  tokens?: { input: number; output: number },
  userId?: string
) {
  const lf = await getLangfuse();
  if (!lf) return;

  const trace = lf.trace({ name: traceName, userId });
  trace.generation({
    name: `${traceName}-generation`,
    model,
    input: prompt,
    output: completion,
    usage: tokens ? { input: tokens.input, output: tokens.output } : undefined,
  });

  await lf.flushAsync().catch(() => {});
}
