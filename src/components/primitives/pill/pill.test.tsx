import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Pill } from './pill';

describe('Pill', () => {
  it('renders children', () => {
    render(<Pill>Confirmed</Pill>);
    expect(screen.getByText('Confirmed')).toBeInTheDocument();
  });

  it('applies tone classes', () => {
    render(<Pill tone="danger">Cancelled</Pill>);
    expect(screen.getByText('Cancelled')).toHaveClass('text-destructive');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Pill tone="success">Open</Pill>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
