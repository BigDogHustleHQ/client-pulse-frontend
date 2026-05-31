import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Badge } from './badge';

describe('Badge', () => {
  it('renders the count', () => {
    render(<Badge count={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('clamps counts above max to "max+"', () => {
    render(<Badge count={128} max={99} />);
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('renders custom children when no count is given', () => {
    render(<Badge>NEW</Badge>);
    expect(screen.getByText('NEW')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<Badge tone="danger" count={3} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
