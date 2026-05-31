import { useAuthStore } from '.';

describe('Store', () => {
  it('re-exports useAuthStore', () => {
    expect(useAuthStore).toBeDefined();
  });
});
