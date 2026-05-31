import { render, screen } from '@testing-library/react';
import { Stack, Inline, Grid } from './layout';

describe('layout helpers', () => {
  it('Stack applies the gap class', () => {
    render(
      <Stack gap="lg" data-testid="stack">
        <span>child</span>
      </Stack>,
    );
    expect(screen.getByTestId('stack')).toHaveClass(
      'flex',
      'flex-col',
      'gap-6',
    );
  });

  it('Inline can disable wrapping', () => {
    render(
      <Inline wrap={false} data-testid="inline">
        <span>child</span>
      </Inline>,
    );
    const el = screen.getByTestId('inline');
    expect(el).toHaveClass('flex', 'items-center');
    expect(el).not.toHaveClass('flex-wrap');
  });

  it('Grid sets the column count via a responsive-overridable class', () => {
    render(
      <Grid cols={4} data-testid="grid">
        <span>child</span>
      </Grid>,
    );
    const el = screen.getByTestId('grid');
    // A bare grid-cols-N class (not an inline style) so pages can override the
    // column count at breakpoints, e.g. className="max-md:grid-cols-2".
    expect(el).toHaveClass('grid', 'grid-cols-4');
    expect(el.style.gridTemplateColumns).toBe('');
  });

  it('Grid falls back to an inline template for uncommon column counts', () => {
    render(
      <Grid cols={16} data-testid="grid">
        <span>child</span>
      </Grid>,
    );
    expect(screen.getByTestId('grid').style.gridTemplateColumns).toBe(
      'repeat(16, minmax(0, 1fr))',
    );
  });
});
