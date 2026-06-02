import { render, screen } from '@testing-library/react';
import RegistrationPage from './page';

jest.mock(
  '@/components/features/auth/RegistrationForm/RegistrationForm',
  () => {
    const MockRegistrationForm = () => <div>RegistrationForm</div>;
    return MockRegistrationForm;
  },
);

describe('RegistrationPage', () => {
  it('renders the registration form', () => {
    render(<RegistrationPage />);
    expect(screen.getByText('RegistrationForm')).toBeInTheDocument();
  });
});
