import { render, screen, act } from '@testing-library/react';
import ForgotPasswordPage from './page';

let capturedOnStepChange: ((index: number) => void) | undefined;

vi.mock(
  '@/components/features/auth/ForgotPasswordForm/ForgotPasswordForm',
  () => ({
    __esModule: true,
    default: ({ onStepChange }: { onStepChange?: (i: number) => void }) => {
      capturedOnStepChange = onStepChange;
      return <div data-testid="forgot-password-form" />;
    },
    STEPS: ['email', 'code', 'password'],
  }),
);

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    capturedOnStepChange = undefined;
  });

  it('renders the form', () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByTestId('forgot-password-form')).toBeInTheDocument();
  });

  it('has an accessible label on the main region', () => {
    render(<ForgotPasswordPage />);
    expect(
      screen.getByRole('main', { name: 'Reset password' }),
    ).toBeInTheDocument();
  });

  it('renders three step dots', () => {
    render(<ForgotPasswordPage />);
    const indicator = screen.getByLabelText('Step indicator');
    expect(indicator.children).toHaveLength(3);
  });

  it('marks the first dot active by default', () => {
    render(<ForgotPasswordPage />);
    const { children } = screen.getByLabelText('Step indicator');
    expect(children[0]).toHaveClass('forgot-password__step--active');
    expect(children[1]).not.toHaveClass('forgot-password__step--active');
    expect(children[2]).not.toHaveClass('forgot-password__step--active');
  });

  it('updates the active dot when the form reports a step change', () => {
    render(<ForgotPasswordPage />);

    act(() => capturedOnStepChange?.(1));

    const { children } = screen.getByLabelText('Step indicator');
    expect(children[0]).not.toHaveClass('forgot-password__step--active');
    expect(children[1]).toHaveClass('forgot-password__step--active');
    expect(children[2]).not.toHaveClass('forgot-password__step--active');
  });

  it('advances to the last dot on step index 2', () => {
    render(<ForgotPasswordPage />);

    act(() => capturedOnStepChange?.(2));

    const { children } = screen.getByLabelText('Step indicator');
    expect(children[2]).toHaveClass('forgot-password__step--active');
  });

  it('renders the footer with the current year', () => {
    render(<ForgotPasswordPage />);
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(String(year)))).toBeInTheDocument();
  });

  it('renders footer navigation links', () => {
    render(<ForgotPasswordPage />);
    expect(
      screen.getByRole('navigation', { name: 'Footer' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();
    expect(screen.getByText('Cookie Settings')).toBeInTheDocument();
  });
});
