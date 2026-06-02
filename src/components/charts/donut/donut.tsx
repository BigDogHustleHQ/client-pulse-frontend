'use client';

import * as React from 'react';
import { Cell, Pie, PieChart } from 'recharts';
import { cn } from '@/lib/utils';

export type DonutDatum = { label: string; value: number; color?: string };

const DEFAULT_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

const colorAt = (datum: DonutDatum, i: number): string => {
  return datum.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length];
};

const Donut = ({
  data,
  width = 220,
  height = 220,
  innerRadius = 64,
  outerRadius = 96,
  total,
  totalLabel = 'Total',
  formatTotal,
  className,
  ...props
}: Omit<React.ComponentProps<'div'>, 'children'> & {
  data: DonutDatum[];
  width?: number;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  /** Override the computed total shown in the center. */
  total?: number;
  totalLabel?: React.ReactNode;
  formatTotal?: (total: number) => React.ReactNode;
}) => {
  const positive = data.filter((d) => d.value > 0);
  const sum = total ?? data.reduce((acc, d) => acc + d.value, 0);
  const isEmpty = positive.length === 0;

  return (
    <div
      data-slot="donut"
      className={cn(
        'flex flex-col items-center gap-4 rounded-xl bg-card p-5 ring-1 ring-foreground/10',
        'animate-in fade-in-0 duration-500 motion-reduce:animate-none',
        className,
      )}
      {...props}
    >
      <div className="relative" style={{ width, height }}>
        {isEmpty ? (
          <div
            data-slot="donut-empty"
            className="flex size-full items-center justify-center rounded-full text-sm text-muted-foreground ring-1 ring-foreground/10 ring-inset"
          >
            No data
          </div>
        ) : (
          <>
            <PieChart width={width} height={height}>
              <Pie
                data={positive}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                paddingAngle={1}
                stroke="var(--card)"
                strokeWidth={2}
                isAnimationActive={false}
              >
                {positive.map((d, i) => (
                  <Cell key={`${d.label}-${i}`} fill={colorAt(d, i)} />
                ))}
              </Pie>
            </PieChart>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-heading text-2xl font-semibold tabular-nums text-foreground">
                {formatTotal ? formatTotal(sum) : sum.toLocaleString()}
              </span>
              {totalLabel && (
                <span className="text-xs text-muted-foreground">
                  {totalLabel}
                </span>
              )}
            </div>
          </>
        )}
      </div>
      {!isEmpty && (
        <ul
          data-slot="donut-legend"
          className="flex flex-wrap justify-center gap-x-4 gap-y-1.5"
        >
          {positive.map((d, i) => (
            <li
              key={`${d.label}-${i}`}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <span
                aria-hidden="true"
                className="size-2.5 rounded-full"
                style={{ backgroundColor: colorAt(d, i) }}
              />
              <span className="text-foreground">{d.label}</span>
              <span className="tabular-nums">{d.value.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export { Donut };
