import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Shared "no data" placeholder for chart components. Callers pass their own
 * `data-slot` (and any other div props) so the empty state stays identifiable
 * per chart.
 */
const ChartEmpty = ({
  className,
  children = 'No data',
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <div
      className={cn(
        'flex min-h-32 items-center justify-center rounded-xl bg-card p-5 text-sm text-muted-foreground ring-1 ring-foreground/10',
        'animate-in fade-in-0 duration-500 motion-reduce:animate-none',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { ChartEmpty };
