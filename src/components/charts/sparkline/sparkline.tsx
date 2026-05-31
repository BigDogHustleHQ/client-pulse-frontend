'use client';

import * as React from 'react';
import { Area, AreaChart } from 'recharts';
import { cn } from '@/lib/utils';

export type SparkPoint = { x: number; y: number };

function normalize(data: number[] | SparkPoint[]): SparkPoint[] {
  return data.map((d, i) => (typeof d === 'number' ? { x: i, y: d } : d));
}

function Sparkline({
  data,
  width = 120,
  height = 32,
  color = 'var(--brand)',
  strokeWidth = 1.5,
  fill = true,
  className,
  ...props
}: Omit<React.ComponentProps<'div'>, 'children'> & {
  data: number[] | SparkPoint[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  fill?: boolean;
}) {
  const points = normalize(data);
  const gradientId = React.useId();

  if (points.length === 0) {
    return (
      <div
        data-slot="sparkline"
        aria-hidden="true"
        className={cn('inline-block rounded-sm bg-muted/50', className)}
        style={{ width, height }}
        {...props}
      />
    );
  }

  return (
    <div
      data-slot="sparkline"
      className={cn('inline-block', className)}
      style={{ width, height }}
      {...props}
    >
      <AreaChart
        width={width}
        height={height}
        data={points}
        margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="y"
          stroke={color}
          strokeWidth={strokeWidth}
          fill={fill ? `url(#${gradientId})` : 'none'}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </div>
  );
}

export { Sparkline };
