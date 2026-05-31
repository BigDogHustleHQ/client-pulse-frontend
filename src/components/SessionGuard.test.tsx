import { render } from '@testing-library/react';
import SessionGuard from './SessionGuard';

const mockSignOut = jest.fn();
const mockReplace = jest.fn();

jest.mock('@clerk/nextjs', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock('@/lib/clerk/session', () => ({
  isSessionAuthorized: jest.fn(),
  clearSessionMarkers: jest.fn(),
}));

import { useAuth } from '@clerk/nextjs';
import { isSessionAuthorized, clearSessionMarkers } from '@/lib/clerk/session';

const mockUseAuth = useAuth as jest.Mock;
const mockIsSessionAuthorized = isSessionAuthorized as jest.Mock;
const mockClearSessionMarkers = clearSessionMarkers as jest.Mock;

describe('SessionGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
