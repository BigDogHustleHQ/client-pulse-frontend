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
  /** Async iterable yielding the response token-by-token. */
  stream: (prompt: string) => AsyncIterable<string>;
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

const wait = (ms: number) => {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
};

export type MockAIProviderProps = MockAIConfig & {
  children: React.ReactNode;
};

const MockAIProvider = ({
  children,
  tokens,
  delay = 40,
}: MockAIProviderProps) => {
  const value = React.useMemo<MockAIContextValue>(() => {
    const resolvedTokens =
      tokens && tokens.length > 0 ? tokens : DEFAULT_TOKENS;

    const stream = (prompt: string): AsyncIterable<string> => {
      void prompt;
      return {
        [Symbol.asyncIterator]: () => {
          let index = 0;

          return {
            next: async (): Promise<IteratorResult<string>> => {
              if (index >= resolvedTokens.length) {
                return { done: true, value: undefined };
              }

              if (delay > 0) await wait(delay);

              const value = resolvedTokens[index];
              index += 1;

              return { done: false, value };
            },
          };
        },
      };
    };

    const complete = async (prompt: string) => {
      let out = '';
      for await (const token of stream(prompt)) out += token;
      return out;
    };

    return { stream, complete };
  }, [tokens, delay]);

  return (
    <MockAIContext.Provider value={value}>{children}</MockAIContext.Provider>
  );
};

const useMockAI = (): MockAIContextValue => {
  const ctx = React.useContext(MockAIContext);
  if (!ctx) {
    throw new Error('useMockAI must be used within a <MockAIProvider>');
  }
  return ctx;
};

export { MockAIProvider, useMockAI, MockAIContext };
