import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold tabular-nums transition-colors motion-reduce:transition-none',
  {
    variants: {
      tone: {
        neutral: 'bg-muted text-muted-foreground',
        brand: 'bg-brand text-brand-foreground',
        primary: 'bg-primary text-primary-foreground',
        danger: 'bg-destructive text-white',
      },
      size: {
        sm: 'h-4 text-[0.625rem]',
        md: 'h-5',
      },
    },
    defaultVariants: { tone: 'neutral', size: 'md' },
  },
);

const Badge = ({
  className,
  tone,
  size,
  count,
  max = 99,
  children,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { count?: number; max?: number }) => {
  const content =
    count === undefined ? children : count > max ? `${max}+` : count;
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ tone, size, className }))}
      {...props}
    >
      {content}
    </span>
  );
};

export { Badge, badgeVariants };
