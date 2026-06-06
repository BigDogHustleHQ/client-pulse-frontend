import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const pillVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-colors motion-reduce:transition-none',
  {
    variants: {
      tone: {
        neutral: 'bg-muted text-muted-foreground',
        brand: 'bg-brand/15 text-brand',
        primary: 'bg-primary/15 text-primary',
        success: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-400',
        warning: 'bg-amber-500/15 text-amber-800 dark:text-amber-400',
        danger: 'bg-destructive/15 text-destructive',
        info: 'bg-sky-500/15 text-sky-800 dark:text-sky-400',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
);

const Pill = ({
  className,
  tone,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof pillVariants>) => {
  return (
    <span
      data-slot="pill"
      className={cn(pillVariants({ tone, className }))}
      {...props}
    />
  );
};

export { Pill, pillVariants };
