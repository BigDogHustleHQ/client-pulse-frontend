import { render, screen } from '@testing-library/react';
import LoginPage from './page';

jest.mock('@/components/features/auth/LoginForm/LoginForm', () => {
  const MockLoginForm = () => <div>LoginForm</div>;
  return MockLoginForm;
});

describe('LoginPage', () => {
  it('renders the login form', () => {
    render(<LoginPage />);
    expect(screen.getByText('LoginForm')).toBeInTheDocument();
  });

  it('renders the brand logo', () => {
    render(<LoginPage />);
    expect(screen.getAllByText('Client Pulse').length).toBeGreaterThanOrEqual(
      1,
    );
  });

  it('renders the hero heading with italic human', () => {
    render(<LoginPage />);
    const heading = screen.getByRole('heading', {
      name: /Intelligence that feels human/i,
    });
    expect(heading).toBeInTheDocument();
    expect(heading.querySelector('em')).toBeInTheDocument();
  });

  it('renders the hero body copy', () => {
    render(<LoginPage />);
    expect(
      screen.getByText(/Experience a growth platform/i),
    ).toBeInTheDocument();
  });

  it('renders the footer with the current year', () => {
    render(<LoginPage />);
    const year = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(`© ${year} Client Pulse`)),
    ).toBeInTheDocument();
  });

  it('renders footer navigation links', () => {
    render(<LoginPage />);
    expect(
      screen.getByRole('link', { name: 'Privacy Policy' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Terms of Service' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Security' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Cookie Settings' }),
    ).toBeInTheDocument();
  });
});
