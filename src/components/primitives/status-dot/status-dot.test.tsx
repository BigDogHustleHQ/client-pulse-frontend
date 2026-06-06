import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { StatusDot } from './status-dot';

describe('StatusDot', () => {
  it('exposes a status role and renders its label', () => {
    render(<StatusDot tone="online" label="Online" />);
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Online');
  });

  it('renders without a label', () => {
    render(<StatusDot tone="busy" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <StatusDot tone="online" pulse label="Live" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
