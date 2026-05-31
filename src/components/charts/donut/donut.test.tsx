import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Donut } from './donut';

const data = [
  { label: 'Dine-in', value: 540 },
  { label: 'Takeout', value: 320 },
  { label: 'Delivery', value: 180 },
];

describe('Donut', () => {
  it('renders a legend entry per datum', () => {
    render(<Donut data={data} />);
    expect(screen.getByText('Dine-in')).toBeInTheDocument();
    expect(screen.getByText('Takeout')).toBeInTheDocument();
    expect(screen.getByText('Delivery')).toBeInTheDocument();
  });

  it('renders the centered total', () => {
    const { container } = render(<Donut data={data} totalLabel="Orders" />);
    expect(screen.getByText('1,040')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders a No data state when every value is zero', () => {
    render(
      <Donut
        data={[
          { label: 'a', value: 0 },
          { label: 'b', value: 0 },
        ]}
      />,
    );
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('renders a No data state for an empty array', () => {
    render(<Donut data={[]} />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<Donut data={data} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
