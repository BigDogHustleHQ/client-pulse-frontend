import { render, screen } from '@testing-library/react';
import SSOCallbackPage from './page';

vi.mock('@clerk/nextjs', () => ({
  AuthenticateWithRedirectCallback: () => <div>Authenticating...</div>,
}));

describe('SSOCallbackPage', () => {
  it('renders the redirect callback component', () => {
    render(<SSOCallbackPage />);
    expect(screen.getByText('Authenticating...')).toBeInTheDocument();
  });
});
