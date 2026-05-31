import * as React from 'react';
import { cn } from '@/lib/utils';

export type Cohort = {
  label: string;
  size: number;
  /** Retention percentages per period (0..N). Trailing entries may be missing. */
  retention: (number | null | undefined)[];
};

function CohortGrid({
  cohorts,
  periods,
  periodLabel = (i) => `P${i}`,
  className,
  ...props
}: Omit<React.ComponentProps<'div'>, 'children'> & {
  cohorts: Cohort[];
  /** Number of period columns. Defaults to the longest retention row. */
  periods?: number;
  periodLabel?: (i: number) => React.ReactNode;
}) {
  const cols =
    periods ?? cohorts.reduce((acc, c) => Math.max(acc, c.retention.length), 0);
  const isEmpty = cohorts.length === 0 || cols === 0;

  if (isEmpty) {
    return (
      <div
        data-slot="cohort-grid"
        className={cn(
          'flex min-h-32 items-center justify-center rounded-xl bg-card p-5 text-sm text-muted-foreground ring-1 ring-foreground/10',
          className,
        )}
        {...props}
      >
        No data
      </div>
    );
  }

  return (
    <div
      data-slot="cohort-grid"
      className={cn(
        'overflow-x-auto rounded-xl bg-card p-5 ring-1 ring-foreground/10',
        className,
      )}
      {...props}
    >
      <table className="w-full border-separate border-spacing-1 text-xs">
        <thead>
          <tr>
            <th className="px-2 py-1 text-left font-medium text-muted-foreground">
              Cohort
            </th>
            <th className="px-2 py-1 text-right font-medium text-muted-foreground">
              Size
            </th>
            {Array.from({ length: cols }).map((_, i) => (
              <th
                key={`p-${i}`}
                className="px-2 py-1 text-center font-medium text-muted-foreground"
              >
                {periodLabel(i)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cohorts.map((cohort, r) => (
            <tr key={`${cohort.label}-${r}`}>
              <td className="px-2 py-1 font-medium whitespace-nowrap text-foreground">
                {cohort.label}
              </td>
              <td className="px-2 py-1 text-right tabular-nums text-muted-foreground">
                {cohort.size.toLocaleString()}
              </td>
              {Array.from({ length: cols }).map((_, c) => {
                const pct = cohort.retention[c];
                const missing = pct === null || pct === undefined;
                const t = missing ? 0 : Math.max(0, Math.min(1, pct / 100));
                const label = missing
                  ? undefined
                  : `${cohort.label} ${typeof periodLabel(c) === 'string' ? periodLabel(c) : `period ${c}`}: ${Math.round(pct)}%`;
                return (
                  <td
                    key={`cell-${r}-${c}`}
                    aria-label={typeof label === 'string' ? label : undefined}
                    className={cn(
                      'px-1 py-1 text-center tabular-nums',
                      missing && 'text-muted-foreground/40',
                    )}
                  >
                    {missing ? (
                      <span aria-hidden="true">—</span>
                    ) : (
                      <span
                        className="block rounded-sm px-1 py-0.5 text-foreground"
                        style={{
                          backgroundColor: 'var(--brand)',
                          opacity: 0.15 + t * 0.85,
                        }}
                      >
                        {Math.round(pct)}%
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { CohortGrid };
