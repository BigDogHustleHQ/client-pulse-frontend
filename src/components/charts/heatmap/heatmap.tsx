import * as React from 'react';
import { cn } from '@/lib/utils';

export type HeatmapCell = number | null | undefined;

export const intensity = (value: number, max: number): number => {
  if (max <= 0) return 0;
  return Math.max(0, Math.min(1, value / max));
};

const Heatmap = ({
  data,
  rowLabels,
  colLabels,
  max,
  legendLabel = 'Activity',
  formatValue,
  className,
  ...props
}: Omit<React.ComponentProps<'div'>, 'children'> & {
  /** 2D array indexed as data[row][col]. Missing cells may be null/undefined. */
  data: HeatmapCell[][];
  rowLabels?: React.ReactNode[];
  colLabels?: React.ReactNode[];
  /** Override the max used for intensity scaling. Defaults to the data max. */
  max?: number;
  legendLabel?: React.ReactNode;
  formatValue?: (value: number) => React.ReactNode;
}) => {
  const cols = data.reduce((acc, row) => Math.max(acc, row.length), 0);
  const isEmpty = data.length === 0 || cols === 0;

  const computedMax =
    max ??
    data.reduce<number>(
      (rowMax, row) =>
        row.reduce<number>(
          (m, cell) => (typeof cell === 'number' ? Math.max(m, cell) : m),
          rowMax,
        ),
      0,
    );

  if (isEmpty) {
    return (
      <div
        data-slot="heatmap"
        className={cn(
          'flex min-h-32 items-center justify-center rounded-xl bg-card p-5 text-sm text-muted-foreground ring-1 ring-foreground/10',
          'animate-in fade-in-0 duration-500 motion-reduce:animate-none',
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
      data-slot="heatmap"
      className={cn(
        'flex flex-col gap-3 rounded-xl bg-card p-5 ring-1 ring-foreground/10',
        'animate-in fade-in-0 duration-500 motion-reduce:animate-none',
        className,
      )}
      {...props}
    >
      <div
        role="grid"
        className="grid gap-1 text-xs"
        style={{
          gridTemplateColumns: `auto repeat(${cols}, minmax(1.25rem, 1fr))`,
        }}
      >
        {colLabels && (
          <div role="row" className="contents">
            <span role="columnheader" aria-hidden="true" />
            {Array.from({ length: cols }).map((_, c) => (
              <span
                key={`col-${c}`}
                role="columnheader"
                className="text-center text-muted-foreground tabular-nums"
              >
                {colLabels[c]}
              </span>
            ))}
          </div>
        )}
        {data.map((row, r) => (
          <div role="row" key={`row-${r}`} className="contents">
            <span
              role="rowheader"
              className="flex items-center pr-1 text-muted-foreground"
            >
              {rowLabels?.[r]}
            </span>
            {Array.from({ length: cols }).map((_, c) => {
              const cell = row[c];
              const missing = cell === null || cell === undefined;
              const t = missing ? 0 : intensity(cell, computedMax);
              const label =
                rowLabels?.[r] != null && colLabels?.[c] != null
                  ? `${rowLabels[r]} ${colLabels[c]}: ${missing ? 'no data' : cell}`
                  : undefined;
              return (
                <div
                  key={`cell-${r}-${c}`}
                  role="gridcell"
                  aria-label={typeof label === 'string' ? label : undefined}
                  title={typeof label === 'string' ? label : undefined}
                  className={cn(
                    'aspect-square rounded-sm',
                    missing && 'bg-muted/40',
                  )}
                  style={
                    missing
                      ? undefined
                      : {
                          backgroundColor: 'var(--brand)',
                          opacity: 0.15 + t * 0.85,
                        }
                  }
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{legendLabel}</span>
        <span>Less</span>
        <div className="flex items-center gap-0.5" aria-hidden="true">
          {[0.15, 0.4, 0.65, 0.85, 1].map((o) => (
            <span
              key={o}
              className="size-3 rounded-sm"
              style={{ backgroundColor: 'var(--brand)', opacity: o }}
            />
          ))}
        </div>
        <span>More</span>
        <span className="tabular-nums">
          (max {formatValue ? formatValue(computedMax) : computedMax})
        </span>
      </div>
    </div>
  );
};

export { Heatmap };
