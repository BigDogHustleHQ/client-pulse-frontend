import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegistrationForm from './RegistrationForm';

const mockCreate = vi.fn();
const mockFinalize = vi.fn();
const mockSSO = vi.fn();
const mockPush = vi.fn();
const mockSetUser = vi.fn();

const mockSignUp = {
  status: 'complete' as string,
  createdSessionId: 'sess_123',
  createdUserId: 'user_123',
  emailAddress: 'jane@company.com',
  firstName: 'Jane',
  lastName: 'Smith',
  create: mockCreate,
  finalize: mockFinalize,
  sso: mockSSO,
};

vi.mock('@clerk/nextjs', () => ({
  useSignUp: vi.fn(() => ({
    signUp: mockSignUp,
    fetchStatus: 'idle',
  })),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('@/store', () => ({
  useAuthStore: (
    selector: (state: {
      setUser: ReturnType<typeof vi.fn>;
    }) => ReturnType<typeof vi.fn>,
  ) => selector({ setUser: mockSetUser }),
}));

describe('RegistrationForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockSignUp.status = 'complete';
    mockSignUp.createdSessionId = 'sess_123';
    mockSignUp.createdUserId = 'user_123';
    mockSignUp.emailAddress = 'jane@company.com';
    mockSignUp.firstName = 'Jane';
    mockSignUp.lastName = 'Smith';
    mockCreate.mockResolvedValue({ error: null });
    mockFinalize.mockResolvedValue({ error: null });
    mockSSO.mockResolvedValue({ error: null });
  });

  it('should render all form elements', () => {
    render(<RegistrationForm />);

    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Business Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Create account' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign up with google/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Log in')).toBeInTheDocument();
  });

  it('should update fields on input', () => {
    render(<RegistrationForm />);
    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'Jane' },
    });
    fireEvent.change(screen.getByLabelText('Last Name'), {
      target: { value: 'Smith' },
    });
    fireEvent.change(screen.getByLabelText('Business Email'), {
      target: { value: 'jane@company.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });

    expect(screen.getByLabelText('First Name')).toHaveValue('Jane');
    expect(screen.getByLabelText('Last Name')).toHaveValue('Smith');
    expect(screen.getByLabelText('Business Email')).toHaveValue(
      'jane@company.com',
    );
    expect(screen.getByLabelText('Password')).toHaveValue('password123');
  });

  it('should toggle password visibility', () => {
    render(<RegistrationForm />);

    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(screen.getByLabelText('Show password'));
    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(screen.getByLabelText('Hide password'));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should create account, populate auth store, and redirect on success', async () => {
    render(<RegistrationForm />);
    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'Jane' },
    });
    fireEvent.change(screen.getByLabelText('Last Name'), {
      target: { value: 'Smith' },
    });
    fireEvent.change(screen.getByLabelText('Business Email'), {
      target: { value: 'jane@company.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        emailAddress: 'jane@company.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
      });
      expect(mockFinalize).toHaveBeenCalled();
      expect(mockSetUser).toHaveBeenCalledWith({
        clerkId: 'user_123',
        email: 'jane@company.com',
        firstName: 'Jane',
        lastName: 'Smith',
      });
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should omit last name when left blank', async () => {
    render(<RegistrationForm />);
    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'Jane' },
    });
    fireEvent.change(screen.getByLabelText('Business Email'), {
      target: { value: 'jane@company.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        emailAddress: 'jane@company.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: undefined,
      });
    });
  });

  it('should show verification message and not set user when status is not complete', async () => {
    mockSignUp.status = 'missing_requirements';

    render(<RegistrationForm />);
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Please check your email to verify your account.',
      );
    });
    expect(mockSetUser).not.toHaveBeenCalled();
  });

  it('should show error message on failed sign up', async () => {
    mockCreate.mockResolvedValueOnce({
      error: { message: 'Email already in use' },
    });

    render(<RegistrationForm />);
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Email already in use',
      );
    });
  });

  it('should show fallback error when no message is provided', async () => {
    mockCreate.mockResolvedValueOnce({ error: {} });

    render(<RegistrationForm />);
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

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

    render(<RegistrationForm />);
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

    expect(
      await screen.findByRole('button', { name: 'Creating account…' }),
    ).toBeDisabled();
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Create account' }),
      ).toBeInTheDocument(),
    );
  });

  it('uses fallbacks when signUp fields are null', async () => {
    mockSignUp.createdUserId = null as unknown as string;
    mockSignUp.emailAddress = null as unknown as string;

    render(<RegistrationForm />);
    fireEvent.change(screen.getByLabelText('Business Email'), {
      target: { value: 'fallback@co.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith({
        clerkId: '',
        email: 'fallback@co.com',
        firstName: 'Jane',
        lastName: 'Smith',
      });
    });
  });

  it('should call google sign up on button click', async () => {
    render(<RegistrationForm />);
    fireEvent.click(
      screen.getByRole('button', { name: /sign up with google/i }),
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
