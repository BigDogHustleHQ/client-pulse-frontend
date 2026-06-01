import { renderHook } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { useCurrentUser } from './useCurrentUser';
import { gqlFetch } from '@/lib/api/graphql';
import { GET_CURRENT_USER } from '@/lib/api/queries';

jest.mock('@tanstack/react-query', () => ({ useQuery: jest.fn(() => ({ data: undefined })) }));
jest.mock('@clerk/nextjs', () => ({ useAuth: jest.fn() }));
jest.mock('@/lib/api/graphql', () => ({ gqlFetch: jest.fn() }));

const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockGqlFetch = gqlFetch as jest.MockedFunction<typeof gqlFetch>;
const mockGetToken = jest.fn();

describe('useCurrentUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({ getToken: mockGetToken, isSignedIn: true } as never);
    mockUseQuery.mockReturnValue({ data: undefined } as never);
  });

  it('passes enabled: true when the user is signed in', () => {
    renderHook(() => useCurrentUser());

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['currentUser'], enabled: true }),
    );
  });

  it('passes enabled: false when the user is not signed in', () => {
    mockUseAuth.mockReturnValue({ getToken: mockGetToken, isSignedIn: false } as never);

    renderHook(() => useCurrentUser());

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false }),
    );
  });

  it('queryFn fetches with the Clerk token', async () => {
    const userData = { getCurrentUser: { id: '1', email: 'a@b.com', firstName: null, lastName: null } };
    mockGetToken.mockResolvedValue('test-token');
    mockGqlFetch.mockResolvedValue(userData as never);

    renderHook(() => useCurrentUser());

    const queryFn = mockUseQuery.mock.calls[0][0].queryFn!;
    const result = await (queryFn as () => Promise<unknown>)();

    expect(mockGetToken).toHaveBeenCalled();
    expect(mockGqlFetch).toHaveBeenCalledWith(GET_CURRENT_USER, 'test-token');
    expect(result).toEqual(userData);
  });
});
