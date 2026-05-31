import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { KPI } from './kpi';

describe('KPI', () => {
  it('renders label and value', () => {
    render(<KPI label="Covers" value="142" />);
    expect(screen.getByText('Covers')).toBeInTheDocument();
    expect(screen.getByText('142')).toBeInTheDocument();
  });

  it('prefixes a positive delta with +', () => {
    render(<KPI label="Covers" value="142" delta={12} />);
    expect(screen.getByText('+12%')).toBeInTheDocument();
  });

  it('shows a negative delta as good when positiveIsGood is false', () => {
    const { container } = render(
      <KPI label="No-shows" value="3%" delta={-2} positiveIsGood={false} />,
    );
    expect(screen.getByText('-2%')).toBeInTheDocument();
    expect(container.querySelector('.text-emerald-600')).toBeTruthy();
  });

  it('marks a positive delta as bad when positiveIsGood is false', () => {
    const { container } = render(
      <KPI label="No-shows" value="3%" delta={2} positiveIsGood={false} />,
    );
    expect(container.querySelector('.text-destructive')).toBeTruthy();
  });

  it('has no axe violations', async () => {
    const { container } = render(<KPI label="Covers" value="142" delta={12} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
