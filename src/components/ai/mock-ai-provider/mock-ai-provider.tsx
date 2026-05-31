'use client';

import * as React from 'react';

/**
 * A canned, deterministic stand-in for a real AI backend. Used by ChatComposer
 * and AIReplyDraft so stories and tests can drive streaming behaviour without a
 * network. Configure `tokens` and `delay` to make output fully deterministic.
 */
export type MockAIConfig = {
  /** Tokens streamed one-by-one by `stream()`. Defaults to a canned reply. */
  tokens?: string[];
  /** Milliseconds between streamed tokens. Use 0 in tests for determinism. */
  delay?: number;
};

export type MockAIContextValue = {
  /** Async generator yielding the response token-by-token. */
  stream: (prompt: string) => AsyncGenerator<string, void, unknown>;
  /** Resolves with the full response in one shot. */
  complete: (prompt: string) => Promise<string>;
};

const DEFAULT_TOKENS = [
  'Thanks ',
  'so ',
  'much ',
  'for ',
  'reaching ',
  'out! ',
  "We'd ",
  'be ',
  'happy ',
  'to ',
  'help.',
];

const MockAIContext = React.createContext<MockAIContextValue | null>(null);

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export type MockAIProviderProps = MockAIConfig & {
  children: React.ReactNode;
};

function MockAIProvider({ children, tokens, delay = 40 }: MockAIProviderProps) {
  const value = React.useMemo<MockAIContextValue>(() => {
    const resolvedTokens =
      tokens && tokens.length > 0 ? tokens : DEFAULT_TOKENS;

    async function* stream(prompt: string) {
      void prompt;
      for (const token of resolvedTokens) {
        if (delay > 0) await wait(delay);
        yield token;
      }
    }

    async function complete(prompt: string) {
      let out = '';
      for await (const token of stream(prompt)) out += token;
      return out;
    }

    return { stream, complete };
  }, [tokens, delay]);

  return (
    <MockAIContext.Provider value={value}>{children}</MockAIContext.Provider>
  );
}

function useMockAI(): MockAIContextValue {
  const ctx = React.useContext(MockAIContext);
  if (!ctx) {
    throw new Error('useMockAI must be used within a <MockAIProvider>');
  }
  return ctx;
}

export { MockAIProvider, useMockAI, MockAIContext };
