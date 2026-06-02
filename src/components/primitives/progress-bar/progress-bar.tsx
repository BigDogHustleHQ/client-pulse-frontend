import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const fillVariants = cva(
  'h-full rounded-full transition-[width] duration-500 ease-out motion-reduce:transition-none',
  {
    variants: {
      tone: {
        brand: 'bg-brand',
        primary: 'bg-primary',
        success: 'bg-emerald-500',
        warning: 'bg-amber-500',
        danger: 'bg-destructive',
      },
    },
    defaultVariants: { tone: 'primary' },
  },
);

const ProgressBar = ({
  value,
  max = 100,
  tone,
  label,
  showValue = false,
  className,
  ...props
}: Omit<React.ComponentProps<'div'>, 'children'> &
  VariantProps<typeof fillVariants> & {
    value: number;
    max?: number;
    label?: React.ReactNode;
    showValue?: boolean;
  }) => {
  const pct = Math.max(0, Math.min(100, max === 0 ? 0 : (value / max) * 100));
  return (
    <div
      data-slot="progress-bar"
      className={cn('flex flex-col gap-1', className)}
      {...props}
    >
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="text-muted-foreground">{label}</span>}
          {showValue && (
            <span className="font-medium tabular-nums">{Math.round(pct)}%</span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={typeof label === 'string' ? label : undefined}
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className={cn(fillVariants({ tone }))}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export { ProgressBar, fillVariants };
