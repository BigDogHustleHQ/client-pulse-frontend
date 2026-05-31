import { useAuthStore } from '.';

describe('store barrel', () => {
  it('re-exports useAuthStore', () => {
    expect(useAuthStore).toBeDefined();
  });
});
