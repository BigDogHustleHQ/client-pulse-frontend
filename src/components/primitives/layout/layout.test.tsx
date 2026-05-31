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

  it('Grid sets the column template', () => {
    render(
      <Grid cols={4} data-testid="grid">
        <span>child</span>
      </Grid>,
    );
    expect(screen.getByTestId('grid').style.gridTemplateColumns).toBe(
      'repeat(4, minmax(0, 1fr))',
    );
  });
});
