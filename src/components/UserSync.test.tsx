import type { MockedFunction, Mock } from 'vitest';
import { render } from '@testing-library/react';
import UserSync from './UserSync';
import { useCurrentUser } from '@/hooks/useCurrentUser';

vi.mock('@/hooks/useCurrentUser', () => ({ useCurrentUser: vi.fn() }));

const mockSetUser = vi.fn();
vi.mock('@/store', () => ({
  useAuthStore: (selector: (state: { setUser: Mock }) => Mock) =>
    selector({ setUser: mockSetUser }),
}));

const mockUseCurrentUser = useCurrentUser as MockedFunction<
  typeof useCurrentUser
>;

describe('UserSync', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders nothing', () => {
    mockUseCurrentUser.mockReturnValue({ data: undefined } as never);
    const { container } = render(<UserSync />);
    expect(container).toBeEmptyDOMElement();
  });

  it('does not call setUser when data is undefined', () => {
    mockUseCurrentUser.mockReturnValue({ data: undefined } as never);
    render(<UserSync />);
    expect(mockSetUser).not.toHaveBeenCalled();
  });

  it('calls setUser with the API user when data is available', () => {
    mockUseCurrentUser.mockReturnValue({
      data: {
        getCurrentUser: {
          id: 'user_123',
          email: 'jane@company.com',
          firstName: 'Jane',
          lastName: 'Smith',
        },
      },
    } as never);

    render(<UserSync />);

    expect(mockSetUser).toHaveBeenCalledWith({
      clerkId: 'user_123',
      email: 'jane@company.com',
      firstName: 'Jane',
      lastName: 'Smith',
    });
  });
});
