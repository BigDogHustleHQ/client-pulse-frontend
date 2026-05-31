import { render, screen } from '@testing-library/react';
import DashboardLayout from './layout';

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

    expect(screen.getByTestId('user-sync')).toBeInTheDocument();
    expect(screen.getByText('page content')).toBeInTheDocument();
  });
});
