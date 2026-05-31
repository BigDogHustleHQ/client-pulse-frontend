import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ConversionFunnel, funnelPercents } from './conversion-funnel';

const stages = [
  { label: 'Visited', value: 100 },
  { label: 'Added to cart', value: 60 },
  { label: 'Checked out', value: 24 },
];

describe('funnelPercents', () => {
  it('computes ofFirst and ofPrevious for seeded data', () => {
    const result = funnelPercents(stages);
    expect(result.map((r) => r.ofFirst)).toEqual([100, 60, 24]);
    expect(result.map((r) => Math.round(r.ofPrevious))).toEqual([100, 60, 40]);
  });

  it('returns an empty array for empty stages', () => {
    expect(funnelPercents([])).toEqual([]);
  });

  it('avoids NaN/Infinity when a value is zero', () => {
    const result = funnelPercents([
      { label: 'a', value: 0 },
      { label: 'b', value: 0 },
    ]);
    expect(result[0]).toEqual({ ofFirst: 0, ofPrevious: 100 });
    expect(result[1]).toEqual({ ofFirst: 0, ofPrevious: 0 });
  });
});

describe('ConversionFunnel', () => {
  it('renders each stage with label and value', () => {
    render(<ConversionFunnel stages={stages} />);
    expect(screen.getByText('Visited')).toBeInTheDocument();
    expect(screen.getByText('Added to cart')).toBeInTheDocument();
    expect(screen.getByText('Checked out')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('shows step-to-step conversion for non-first stages', () => {
    render(<ConversionFunnel stages={stages} />);
    expect(screen.getByText('60% of previous step')).toBeInTheDocument();
    expect(screen.getByText('40% of previous step')).toBeInTheDocument();
  });

  it('renders an empty state for no stages', () => {
    render(<ConversionFunnel stages={[]} />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<ConversionFunnel stages={stages} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
