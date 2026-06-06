import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Heatmap, intensity } from './heatmap';

const data = [
  [2, 4, 12],
  [3, 5, 14],
];

describe('intensity', () => {
  it('scales a value relative to max', () => {
    expect(intensity(0, 10)).toBe(0);
    expect(intensity(5, 10)).toBe(0.5);
    expect(intensity(10, 10)).toBe(1);
  });

  it('clamps and avoids division by zero', () => {
    expect(intensity(5, 0)).toBe(0);
    expect(intensity(20, 10)).toBe(1);
    expect(intensity(-5, 10)).toBe(0);
  });
});

describe('Heatmap', () => {
  it('renders a gridcell for every cell', () => {
    render(
      <Heatmap
        data={data}
        rowLabels={['Mon', 'Tue']}
        colLabels={['9am', '11am', '1pm']}
      />,
    );
    expect(screen.getAllByRole('gridcell')).toHaveLength(6);
    expect(screen.getByText('Mon')).toBeInTheDocument();
  });

  it('renders missing cells without crashing', () => {
    render(
      <Heatmap
        data={[
          [2, null, 4],
          [undefined, 5, 6],
        ]}
        rowLabels={['Mon', 'Tue']}
        colLabels={['9am', '11am', '1pm']}
      />,
    );
    expect(screen.getAllByRole('gridcell')).toHaveLength(6);
  });

  it('renders a No data state for empty input', () => {
    render(<Heatmap data={[]} />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Heatmap
        data={data}
        rowLabels={['Mon', 'Tue']}
        colLabels={['9am', '11am', '1pm']}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
