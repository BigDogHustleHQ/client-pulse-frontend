import useAuthStore from './useAuthStore';
import type { AuthUser } from './types';

const sampleUser: AuthUser = {
  clerkId: 'user_123',
  email: 'owner@business.com',
  firstName: 'Jordan',
  lastName: 'Rivera',
};

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null });
  });

  it('starts with no user', () => {
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('sets the user', () => {
    useAuthStore.getState().setUser(sampleUser);
    expect(useAuthStore.getState().user).toEqual(sampleUser);
  });

  it('clears the user', () => {
    useAuthStore.getState().setUser(sampleUser);
    useAuthStore.getState().clearAuth();
    expect(useAuthStore.getState().user).toBeNull();
  });
});
