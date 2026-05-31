import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { CohortGrid } from './cohort-grid';

const cohorts = [
  { label: 'Jan', size: 320, retention: [100, 62, 48] },
  { label: 'Feb', size: 410, retention: [100, 66] },
];

describe('CohortGrid', () => {
  it('renders cohort labels and sizes', () => {
    render(<CohortGrid cohorts={cohorts} />);
    expect(screen.getByText('Jan')).toBeInTheDocument();
    expect(screen.getByText('Feb')).toBeInTheDocument();
    expect(screen.getByText('320')).toBeInTheDocument();
  });

  it('renders retention percentages', () => {
    render(<CohortGrid cohorts={cohorts} />);
    expect(screen.getByText('62%')).toBeInTheDocument();
    expect(screen.getByText('48%')).toBeInTheDocument();
  });

  it('renders blank cells for missing later periods', () => {
    render(<CohortGrid cohorts={cohorts} />);
    // Feb has no period-2 value; column count is 3 so a blank dash appears.
    expect(screen.getAllByText('—').length).toBeGreaterThan(0);
  });

  it('renders a No data state when there are no cohorts', () => {
    render(<CohortGrid cohorts={[]} />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<CohortGrid cohorts={cohorts} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
