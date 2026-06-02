import { renderHook } from '@testing-library/react';
import { MockAIProvider, useMockAI } from './mock-ai-provider';

const wrapper = (tokens: string[]) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <MockAIProvider tokens={tokens} delay={0}>
        {children}
      </MockAIProvider>
    );
  };
  return Wrapper;
};

describe('MockAIProvider', () => {
  it('streams tokens in order', async () => {
    const { result } = renderHook(() => useMockAI(), {
      wrapper: wrapper(['a', 'b', 'c']),
    });
    const out: string[] = [];
    for await (const token of result.current.stream('x')) out.push(token);
    expect(out).toEqual(['a', 'b', 'c']);
  });

  it('complete joins tokens', async () => {
    const { result } = renderHook(() => useMockAI(), {
      wrapper: wrapper(['hel', 'lo']),
    });
    await expect(result.current.complete('x')).resolves.toBe('hello');
  });

  it('throws when used outside the provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useMockAI())).toThrow(/MockAIProvider/);
    spy.mockRestore();
  });
});
