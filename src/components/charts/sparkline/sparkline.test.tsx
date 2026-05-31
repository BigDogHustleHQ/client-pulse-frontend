import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Sparkline } from './sparkline';

describe('Sparkline', () => {
  it('renders an svg for numeric data', () => {
    const { container } = render(<Sparkline data={[1, 2, 3, 4, 5]} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders an svg for point data', () => {
    const { container } = render(
      <Sparkline
        data={[
          { x: 0, y: 1 },
          { x: 1, y: 4 },
          { x: 2, y: 2 },
        ]}
      />,
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders a placeholder (no svg) for empty data', () => {
    const { container } = render(<Sparkline data={[]} />);
    expect(container.querySelector('svg')).not.toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="sparkline"]'),
    ).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<Sparkline data={[3, 5, 4, 8, 6]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
