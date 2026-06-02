import * as React from 'react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

type Trend = 'up' | 'down' | 'flat';

const trendFromDelta = (delta?: number): Trend => {
  if (delta === undefined || delta === 0) return 'flat';
  return delta > 0 ? 'up' : 'down';
};

const KPI = ({
  label,
  value,
  delta,
  deltaLabel,
  positiveIsGood = true,
  icon,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  label: React.ReactNode;
  value: React.ReactNode;
  delta?: number;
  deltaLabel?: React.ReactNode;
  positiveIsGood?: boolean;
  icon?: React.ReactNode;
}) => {
  const trend = trendFromDelta(delta);
  const good = trend === 'flat' ? null : (trend === 'up') === positiveIsGood;
  const TrendIcon =
    trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;

  return (
    <div
      data-slot="kpi"
      className={cn(
        'flex flex-col gap-1.5 rounded-xl bg-card p-4 ring-1 ring-foreground/10',
        'animate-in fade-in-0 duration-300 motion-reduce:animate-none',
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <span className="font-heading text-2xl font-semibold tracking-tight tabular-nums">
        {value}
      </span>
      {(delta !== undefined || deltaLabel) && (
        <span
          className={cn(
            'inline-flex items-center gap-1 text-xs font-medium',
            good === null && 'text-muted-foreground',
            good === true && 'text-emerald-600 dark:text-emerald-400',
            good === false && 'text-destructive',
          )}
        >
          <TrendIcon className="size-3.5" />
          {delta !== undefined && (
            <span className="tabular-nums">
              {delta > 0 ? '+' : ''}
              {delta}%
            </span>
          )}
          {deltaLabel && (
            <span className="text-muted-foreground">{deltaLabel}</span>
          )}
        </span>
      )}
    </div>
  );
};

export { KPI };
