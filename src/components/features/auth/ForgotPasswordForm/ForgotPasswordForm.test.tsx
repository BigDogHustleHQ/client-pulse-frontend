import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForgotPasswordForm from './ForgotPasswordForm';

const mockCreate = vi.fn();
const mockSendCode = vi.fn();
const mockVerifyCode = vi.fn();
const mockSubmitPassword = vi.fn();
const mockPush = vi.fn();

const mockSignIn = {
  create: mockCreate,
  resetPasswordEmailCode: {
    sendCode: mockSendCode,
    verifyCode: mockVerifyCode,
    submitPassword: mockSubmitPassword,
  },
};

vi.mock('@clerk/nextjs', () => ({
  useSignIn: vi.fn(() => ({
    signIn: mockSignIn,
    fetchStatus: 'idle',
  })),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('ForgotPasswordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreate.mockResolvedValue({ error: null });
    mockSendCode.mockResolvedValue({ error: null });
    mockVerifyCode.mockResolvedValue({ error: null });
    mockSubmitPassword.mockResolvedValue({ error: null });
  });

  // ─── Step 1: email ────────────────────────────────────────────────────────

  it('renders step 1 form elements', () => {
    render(<ForgotPasswordForm />);

    expect(screen.getByText('Reset Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Send Reset Link →' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: '← Back to Login' }),
    ).toBeInTheDocument();
  });

  it('advances to step 2 on successful code send', async () => {
    render(<ForgotPasswordForm />);
    fireEvent.change(screen.getByLabelText('Email Address'), {
      target: { value: 'user@company.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send Reset Link →' }));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        identifier: 'user@company.com',
      });
      expect(mockSendCode).toHaveBeenCalledWith();
      expect(screen.getByText('Check Your Email')).toBeInTheDocument();
    });
  });

  it('shows error message when code send fails', async () => {
    mockCreate.mockResolvedValueOnce({ error: { message: 'Email not found' } });

    render(<ForgotPasswordForm />);
    fireEvent.change(screen.getByLabelText('Email Address'), {
      target: { value: 'bad@co.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send Reset Link →' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Email not found');
    });
    expect(screen.getByText('Reset Password')).toBeInTheDocument();
  });

  it('shows error message when reset code send fails', async () => {
    mockSendCode.mockResolvedValueOnce({
      error: { message: 'Could not send code' },
    });

    render(<ForgotPasswordForm />);
    fireEvent.change(screen.getByLabelText('Email Address'), {
      target: { value: 'user@company.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send Reset Link →' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Could not send code',
      );
    });
    expect(screen.getByText('Reset Password')).toBeInTheDocument();
  });

  it('shows fallback error when no message on send failure', async () => {
    mockCreate.mockResolvedValueOnce({ error: {} });

    render(<ForgotPasswordForm />);
    fireEvent.click(screen.getByRole('button', { name: 'Send Reset Link →' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Something went wrong. Please try again.',
      );
    });
  });

  it('shows loading state while sending code', async () => {
    mockCreate.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ error: null }), 50),
        ),
    );

    render(<ForgotPasswordForm />);
    fireEvent.click(screen.getByRole('button', { name: 'Send Reset Link →' }));

    expect(
      await screen.findByRole('button', { name: 'Sending…' }),
    ).toBeDisabled();
    await waitFor(() =>
      expect(screen.getByText('Check Your Email')).toBeInTheDocument(),
    );
  });

  // ─── Step 2: verification code ────────────────────────────────────────────

  const advanceToStep2 = async () => {
    render(<ForgotPasswordForm />);
    fireEvent.change(screen.getByLabelText('Email Address'), {
      target: { value: 'user@company.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send Reset Link →' }));
    await waitFor(() =>
      expect(screen.getByText('Check Your Email')).toBeInTheDocument(),
    );
  };

  it('renders step 2 form elements', async () => {
    await advanceToStep2();
    expect(screen.getByLabelText('Verification Code')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Verify Code →' }),
    ).toBeInTheDocument();
  });

  it('includes the submitted email in the step 2 subtitle', async () => {
    await advanceToStep2();
    expect(screen.getByText(/user@company\.com/)).toBeInTheDocument();
  });

  it('advances to step 3 on successful code verification', async () => {
    await advanceToStep2();
    fireEvent.change(screen.getByLabelText('Verification Code'), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Verify Code →' }));

    await waitFor(() => {
      expect(mockVerifyCode).toHaveBeenCalledWith({ code: '123456' });
      expect(
        screen.getByRole('heading', { name: 'New Password' }),
      ).toBeInTheDocument();
    });
  });

  it('shows error when code verification fails', async () => {
    mockVerifyCode.mockResolvedValueOnce({
      error: { message: 'Invalid code' },
    });

    await advanceToStep2();
    fireEvent.change(screen.getByLabelText('Verification Code'), {
      target: { value: '000000' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Verify Code →' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid code');
    });
    expect(
      screen.getByRole('heading', { name: 'Check Your Email' }),
    ).toBeInTheDocument();
  });

  it('shows fallback error when no message on verify failure', async () => {
    mockVerifyCode.mockResolvedValueOnce({ error: {} });

    await advanceToStep2();
    fireEvent.click(screen.getByRole('button', { name: 'Verify Code →' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Something went wrong. Please try again.',
      );
    });
  });

  it('shows loading state while verifying code', async () => {
    mockVerifyCode.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ error: null }), 50),
        ),
    );

    await advanceToStep2();
    fireEvent.click(screen.getByRole('button', { name: 'Verify Code →' }));

    expect(
      await screen.findByRole('button', { name: 'Verifying…' }),
    ).toBeDisabled();
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: 'New Password' }),
      ).toBeInTheDocument(),
    );
  });

  // ─── Step 3: new password ─────────────────────────────────────────────────

  const advanceToStep3 = async () => {
    await advanceToStep2();
    fireEvent.change(screen.getByLabelText('Verification Code'), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Verify Code →' }));
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: 'New Password' }),
      ).toBeInTheDocument(),
    );
  };

  it('renders step 3 form elements', async () => {
    await advanceToStep3();
    expect(
      screen.getByRole('heading', { name: 'New Password' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Reset Password →' }),
    ).toBeInTheDocument();
  });

  it('shows error when passwords do not match', async () => {
    await advanceToStep3();
    fireEvent.change(screen.getByLabelText('New Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'different' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Reset Password →' }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Passwords do not match.',
    );
    expect(mockSubmitPassword).not.toHaveBeenCalled();
  });

  it('submits new password and shows success screen', async () => {
    await advanceToStep3();
    fireEvent.change(screen.getByLabelText('New Password'), {
      target: { value: 'newpass123' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'newpass123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Reset Password →' }));

    await waitFor(() => {
      expect(mockSubmitPassword).toHaveBeenCalledWith({
        password: 'newpass123',
      });
      expect(screen.getByText('Password Updated!')).toBeInTheDocument();
    });
  });

  it('shows error when password submit fails', async () => {
    mockSubmitPassword.mockResolvedValueOnce({
      error: { message: 'Password too weak' },
    });

    await advanceToStep3();
    fireEvent.change(screen.getByLabelText('New Password'), {
      target: { value: 'abc' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'abc' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Reset Password →' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Password too weak');
    });
    expect(
      screen.getByRole('heading', { name: 'New Password' }),
    ).toBeInTheDocument();
  });

  it('shows fallback error when no message on submit failure', async () => {
    mockSubmitPassword.mockResolvedValueOnce({ error: {} });

    await advanceToStep3();
    fireEvent.change(screen.getByLabelText('New Password'), {
      target: { value: 'abc' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'abc' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Reset Password →' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Something went wrong. Please try again.',
      );
    });
  });

  it('toggles confirm password visibility in step 3', async () => {
    await advanceToStep3();

    const confirmInput = screen.getByLabelText('Confirm Password');
    expect(confirmInput).toHaveAttribute('type', 'password');

    fireEvent.click(screen.getByLabelText('Show confirm password'));
    expect(confirmInput).toHaveAttribute('type', 'text');

    fireEvent.click(screen.getByLabelText('Hide confirm password'));
    expect(confirmInput).toHaveAttribute('type', 'password');
  });

  it('shows loading state while resetting password', async () => {
    mockSubmitPassword.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ error: null }), 50),
        ),
    );

    await advanceToStep3();
    fireEvent.change(screen.getByLabelText('New Password'), {
      target: { value: 'newpass123' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'newpass123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Reset Password →' }));

    expect(
      await screen.findByRole('button', { name: 'Resetting…' }),
    ).toBeDisabled();
    await waitFor(() =>
      expect(screen.getByText('Password Updated!')).toBeInTheDocument(),
    );
  });

  it('toggles password visibility in step 3', async () => {
    await advanceToStep3();

    const passwordInput = screen.getByLabelText('New Password');
    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(screen.getByLabelText('Show password'));
    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(screen.getByLabelText('Hide password'));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  // ─── Success screen ───────────────────────────────────────────────────────

  it('navigates to login when Sign in now is clicked on success screen', async () => {
    await advanceToStep3();
    fireEvent.change(screen.getByLabelText('New Password'), {
      target: { value: 'newpass123' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'newpass123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Reset Password →' }));

    await waitFor(() =>
      expect(screen.getByText('Password Updated!')).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Sign in now →' }));

    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  // ─── Shared ───────────────────────────────────────────────────────────────

  it('Back to Login link points to /login', () => {
    render(<ForgotPasswordForm />);
    expect(
      screen.getByRole('link', { name: '← Back to Login' }),
    ).toHaveAttribute('href', '/login');
  });

  it('calls onStepChange when step advances', async () => {
    const onStepChange = vi.fn();
    render(<ForgotPasswordForm onStepChange={onStepChange} />);

    fireEvent.change(screen.getByLabelText('Email Address'), {
      target: { value: 'user@company.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send Reset Link →' }));

    await waitFor(() => expect(onStepChange).toHaveBeenCalledWith(1));
  });
});
