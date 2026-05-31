import { render, screen } from '@testing-library/react';
import LoginPage from './page';

jest.mock(
  '@/components/features/auth/LoginForm/LoginForm',
  () =>
    function MockLoginForm() {
      return <div>LoginForm</div>;
    },
);

describe('LoginPage', () => {
  it('renders the login form', () => {
    render(<LoginPage />);
    expect(screen.getByText('LoginForm')).toBeInTheDocument();
  });
});
