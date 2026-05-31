import { render } from '@testing-library/react';
import UserSync from './UserSync';
import { useCurrentUser } from '@/hooks/useCurrentUser';

jest.mock('@/hooks/useCurrentUser', () => ({ useCurrentUser: jest.fn() }));

const mockSetUser = jest.fn();
jest.mock('@/store', () => ({
  useAuthStore: (selector: (state: { setUser: jest.Mock }) => jest.Mock) =>
    selector({ setUser: mockSetUser }),
}));

const mockUseCurrentUser = useCurrentUser as jest.MockedFunction<typeof useCurrentUser>;

describe('UserSync', () => {
  beforeEach(() => jest.clearAllMocks());

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
