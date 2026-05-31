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

function Grid({
  cols = 3,
  gap = 'md',
  className,
  ...props
}: React.ComponentProps<'div'> & { cols?: number; gap?: Gap }) {
  return (
    <div
      data-slot="grid"
      className={cn('grid', gapClass[gap], className)}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        ...props.style,
      }}
      {...props}
    />
  );
}

export { Stack, Inline, Grid };
