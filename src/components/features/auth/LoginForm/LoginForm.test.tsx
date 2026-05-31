import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from './LoginForm';

const mockCreate = jest.fn();
const mockFinalize = jest.fn();
const mockSSO = jest.fn();
const mockPush = jest.fn();
const mockSetUser = jest.fn();

const mockSignIn = {
  status: 'complete' as string,
  createdSessionId: 'session_123',
  identifier: 'test@company.com',
  userData: { firstName: 'Jane', lastName: 'Smith' },
  create: mockCreate,
  finalize: mockFinalize,
  sso: mockSSO,
};

jest.mock('@clerk/nextjs', () => ({
  useSignIn: jest.fn(() => ({
    signIn: mockSignIn,
    fetchStatus: 'idle',
  })),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/store', () => ({
  useAuthStore: (selector: (state: { setUser: jest.Mock }) => jest.Mock) =>
    selector({ setUser: mockSetUser }),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockSignIn.status = 'complete';
    mockSignIn.createdSessionId = 'session_123';
    mockSignIn.identifier = 'test@company.com';
    mockSignIn.userData = { firstName: 'Jane', lastName: 'Smith' };
    mockCreate.mockResolvedValue({ error: null });
    mockFinalize.mockResolvedValue({ error: null });
    mockSSO.mockResolvedValue({ error: null });
  });

  it('should render all form elements', () => {
    render(<LoginForm />);

    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByLabelText('Business Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Sign in to platform' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in with google/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    expect(screen.getByText('Contact sales')).toBeInTheDocument();
  });

  it('should update email and password on input', () => {
    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText('Business Email'), {
      target: { value: 'test@company.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });

    expect(screen.getByLabelText('Business Email')).toHaveValue(
      'test@company.com',
    );
    expect(screen.getByLabelText('Password')).toHaveValue('password123');
  });

  it('should toggle password visibility', () => {
    render(<LoginForm />);

    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(screen.getByLabelText('Show password'));
    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(screen.getByLabelText('Hide password'));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should toggle remember me checkbox', () => {
    render(<LoginForm />);

    const toggle = screen.getByLabelText('Remember me');
    expect(toggle).not.toBeChecked();

    fireEvent.click(toggle);
    expect(toggle).toBeChecked();
  });

  it('should sign in, populate auth store, and redirect on success', async () => {
    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText('Business Email'), {
      target: { value: 'test@company.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: 'Sign in to platform' }),
    );

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        identifier: 'test@company.com',
        password: 'password123',
      });
      expect(mockFinalize).toHaveBeenCalled();
      expect(mockSetUser).toHaveBeenCalledWith({
        clerkId: 'session_123',
        email: 'test@company.com',
        firstName: 'Jane',
        lastName: 'Smith',
      });
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should not redirect or set user when sign in status is not complete', async () => {
    mockSignIn.status = 'needs_second_factor';

    render(<LoginForm />);
    fireEvent.click(
      screen.getByRole('button', { name: 'Sign in to platform' }),
    );

    await waitFor(() => expect(mockCreate).toHaveBeenCalled());
    expect(mockSetUser).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should show error message on failed sign in', async () => {
    mockCreate.mockResolvedValueOnce({
      error: { message: 'Invalid credentials' },
    });

    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText('Business Email'), {
      target: { value: 'test@company.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrong' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: 'Sign in to platform' }),
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Invalid credentials',
      );
    });
  });

  it('should show fallback error when no message is provided', async () => {
    mockCreate.mockResolvedValueOnce({ error: {} });

    render(<LoginForm />);
    fireEvent.click(
      screen.getByRole('button', { name: 'Sign in to platform' }),
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Something went wrong. Please try again.',
      );
    });
  });

  it('should show loading state while submitting', async () => {
    mockCreate.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ error: null }), 50),
        ),
    );

    render(<LoginForm />);
    fireEvent.click(
      screen.getByRole('button', { name: 'Sign in to platform' }),
    );

    expect(
      await screen.findByRole('button', { name: 'Signing in…' }),
    ).toBeDisabled();
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Sign in to platform' }),
      ).toBeInTheDocument(),
    );
  });

  it('should call Google sign in on button click', async () => {
    render(<LoginForm />);
    fireEvent.click(
      screen.getByRole('button', { name: /sign in with google/i }),
    );

    await waitFor(() => {
      expect(mockSSO).toHaveBeenCalledWith({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectCallbackUrl: '/dashboard',
      });
    });
  });
});
