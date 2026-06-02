import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const dotVariants = cva('inline-block size-2 shrink-0 rounded-full', {
  variants: {
    tone: {
      neutral: 'bg-muted-foreground',
      online: 'bg-emerald-500',
      busy: 'bg-amber-500',
      offline: 'bg-muted-foreground/40',
      danger: 'bg-destructive',
      brand: 'bg-brand',
    },
  },
  defaultVariants: { tone: 'neutral' },
});

const StatusDot = ({
  className,
  tone,
  pulse = false,
  label,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof dotVariants> & {
    pulse?: boolean;
    label?: React.ReactNode;
  }) => {
  const dot = (
    <span className="relative inline-flex">
      <span className={cn(dotVariants({ tone }), className)} />
      {pulse && (
        <span
          aria-hidden
          className={cn(
            'absolute inline-flex size-full animate-ping rounded-full opacity-60',
            dotVariants({ tone }),
          )}
        />
      )}
    </span>
  );

  if (!label) {
    return (
      <span data-slot="status-dot" role="status" {...props}>
        {dot}
      </span>
    );
  }

  return (
    <span
      data-slot="status-dot"
      role="status"
      className={cn('inline-flex items-center gap-1.5 text-sm', className)}
      {...props}
    >
      {dot}
      <span>{label}</span>
    </span>
  );
};

export { StatusDot, dotVariants };
