import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ProgressBar } from './progress-bar';

describe('ProgressBar', () => {
  it('exposes accessible progress values', () => {
    render(<ProgressBar value={64} label="Budget" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '64');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('computes fill width from value/max', () => {
    render(<ProgressBar value={25} max={50} label="Half" />);
    const fill = screen.getByRole('progressbar').firstChild as HTMLElement;
    expect(fill.style.width).toBe('50%');
  });

  it('clamps values above max to 100%', () => {
    render(<ProgressBar value={200} max={100} label="Over" />);
    const fill = screen.getByRole('progressbar').firstChild as HTMLElement;
    expect(fill.style.width).toBe('100%');
  });

  it('handles a zero max without dividing by zero', () => {
    render(<ProgressBar value={5} max={0} label="Zero" />);
    const fill = screen.getByRole('progressbar').firstChild as HTMLElement;
    expect(fill.style.width).toBe('0%');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <ProgressBar value={64} label="Budget" showValue />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
