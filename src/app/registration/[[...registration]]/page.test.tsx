import { render, screen } from '@testing-library/react';
import RegistrationPage from './page';

vi.mock('@/components/features/auth/RegistrationForm/RegistrationForm', () => ({
  default: function MockRegistrationForm() {
    return <div>RegistrationForm</div>;
  },
}));

describe('RegistrationPage', () => {
  it('renders the registration form', () => {
    render(<RegistrationPage />);
    expect(screen.getByText('RegistrationForm')).toBeInTheDocument();
  });
});
