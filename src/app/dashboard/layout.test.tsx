import { render, screen } from '@testing-library/react';
import DashboardLayout from './layout';

jest.mock('@/components/SessionGuard', () => ({
  __esModule: true,
  default: () => <div data-testid="session-guard" />,
}));

jest.mock('@/components/UserSync', () => ({
  __esModule: true,
  default: () => <div data-testid="user-sync" />,
}));

describe('DashboardLayout', () => {
  it('renders UserSync and children', () => {
    render(
      <DashboardLayout>
        <div>page content</div>
      </DashboardLayout>,
    );

    expect(screen.getByTestId('session-guard')).toBeInTheDocument();
    expect(screen.getByTestId('user-sync')).toBeInTheDocument();
    expect(screen.getByText('page content')).toBeInTheDocument();
  });
});
