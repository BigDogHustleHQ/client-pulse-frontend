import type { Mock } from 'vitest';
import { render } from '@testing-library/react';
import SessionGuard from './SessionGuard';

const mockSignOut = vi.fn();
const mockReplace = vi.fn();

vi.mock('@clerk/nextjs', () => ({
  useAuth: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

vi.mock('@/lib/clerk/session', () => ({
  isSessionAuthorized: vi.fn(),
  clearSessionMarkers: vi.fn(),
}));

import { useAuth } from '@clerk/nextjs';
import { isSessionAuthorized, clearSessionMarkers } from '@/lib/clerk/session';

const mockUseAuth = useAuth as Mock;
const mockIsSessionAuthorized = isSessionAuthorized as Mock;
const mockClearSessionMarkers = clearSessionMarkers as Mock;

describe('SessionGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSignOut.mockResolvedValue(undefined);
  });

  it('does nothing when the user is not signed in', () => {
    mockUseAuth.mockReturnValue({ isSignedIn: false, signOut: mockSignOut });
    mockIsSessionAuthorized.mockReturnValue(false);

    render(<SessionGuard />);

    expect(mockSignOut).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('does nothing when signed in with a valid session marker', () => {
    mockUseAuth.mockReturnValue({ isSignedIn: true, signOut: mockSignOut });
    mockIsSessionAuthorized.mockReturnValue(true);

    render(<SessionGuard />);

    expect(mockSignOut).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('signs out and redirects when signed in but no session marker exists', async () => {
    mockUseAuth.mockReturnValue({ isSignedIn: true, signOut: mockSignOut });
    mockIsSessionAuthorized.mockReturnValue(false);

    render(<SessionGuard />);

    await Promise.resolve();

    expect(mockClearSessionMarkers).toHaveBeenCalled();
    expect(mockSignOut).toHaveBeenCalled();
  });
});
