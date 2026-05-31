import * as React from 'react';
import { cn } from '@/lib/utils';

const gapClass = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
} as const;

type Gap = keyof typeof gapClass;

function Stack({
  gap = 'md',
  align,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  gap?: Gap;
  align?: 'start' | 'center' | 'end' | 'stretch';
}) {
  return (
    <div
      data-slot="stack"
      className={cn(
        'flex flex-col',
        gapClass[gap],
        align === 'center' && 'items-center',
        align === 'start' && 'items-start',
        align === 'end' && 'items-end',
        align === 'stretch' && 'items-stretch',
        className,
      )}
      {...props}
    />
  );
}

function Inline({
  gap = 'sm',
  wrap = true,
  className,
  ...props
}: React.ComponentProps<'div'> & { gap?: Gap; wrap?: boolean }) {
  return (
    <div
      data-slot="inline"
      className={cn(
        'flex items-center',
        wrap && 'flex-wrap',
        gapClass[gap],
        className,
      )}
      {...props}
    />
  );
}

// Static class strings so Tailwind's scanner generates each utility — a
// computed `grid-cols-${cols}` would never be detected. A bare grid-cols-N
// class (instead of an inline grid-template-columns style) is what lets pages
// override the column count at breakpoints, e.g. className="max-md:grid-cols-2".
// Counts outside this range fall back to the inline template.
const colsClass: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  7: 'grid-cols-7',
  8: 'grid-cols-8',
  9: 'grid-cols-9',
  10: 'grid-cols-10',
  11: 'grid-cols-11',
  12: 'grid-cols-12',
};

function Grid({
  cols = 3,
  gap = 'md',
  className,
  style,
  ...props
}: React.ComponentProps<'div'> & { cols?: number; gap?: Gap }) {
  const colClass = colsClass[cols];
  return (
    <div
      data-slot="grid"
      className={cn('grid', colClass, gapClass[gap], className)}
      style={
        colClass
          ? style
          : { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, ...style }
      }
      {...props}
    />
  );
}

export { Stack, Inline, Grid };
