import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DashboardPage from './page';

const mockSignOut = vi.fn();
const mockPush = vi.fn();
const mockUseAuthStore = vi.fn();

vi.mock('@clerk/nextjs', () => ({
  useAuth: vi.fn(() => ({ signOut: mockSignOut })),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('@/store', () => ({
  useAuthStore: (selector: (state: { user: unknown }) => unknown) =>
    selector({ user: mockUseAuthStore() }),
}));

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSignOut.mockResolvedValue(undefined);
  });

  it('renders placeholder content', () => {
    mockUseAuthStore.mockReturnValue(null);
    render(<DashboardPage />);

    expect(
      screen.getByRole('heading', { name: 'Dashboard' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Total Customers')).toBeInTheDocument();
    expect(screen.getByText('Active Workflows')).toBeInTheDocument();
    expect(screen.getByText('Integrations')).toBeInTheDocument();
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });

  it('shows generic greeting when user has no first name', () => {
    mockUseAuthStore.mockReturnValue(null);
    render(<DashboardPage />);

    expect(screen.getByText('Welcome back')).toBeInTheDocument();
  });

  it('shows personalised greeting when user has a first name', () => {
    mockUseAuthStore.mockReturnValue({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@co.com',
      clerkId: '1',
    });
    render(<DashboardPage />);

    expect(screen.getByText('Welcome back, Jane')).toBeInTheDocument();
  });

  it('signs out and redirects to login on button click', async () => {
    mockUseAuthStore.mockReturnValue(null);
    render(<DashboardPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });
});
