import { renderHook, act } from '@testing-library/react';
import useAuthStore from './useAuthStore';

const user = { clerkId: 'abc', email: 'a@b.com', firstName: 'Jane', lastName: 'Smith' };

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null });
  });

  it('starts with null user', () => {
    const { result } = renderHook(() => useAuthStore((s) => s.user));
    expect(result.current).toBeNull();
  });

  it('setUser updates the user', () => {
    const { result } = renderHook(() => useAuthStore((s) => s));
    act(() => { result.current.setUser(user); });
    expect(result.current.user).toEqual(user);
  });

  it('clearAuth resets user to null', () => {
    const { result } = renderHook(() => useAuthStore((s) => s));
    act(() => { result.current.setUser(user); });
    act(() => { result.current.clearAuth(); });
    expect(result.current.user).toBeNull();
  });
});
