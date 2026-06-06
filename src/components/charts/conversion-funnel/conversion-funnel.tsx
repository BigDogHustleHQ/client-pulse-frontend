import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChartEmpty } from '../chart-empty';

export type FunnelStage = { label: string; value: number };

export type FunnelPercents = { ofFirst: number; ofPrevious: number };

export const funnelPercents = (stages: FunnelStage[]): FunnelPercents[] => {
  if (stages.length === 0) return [];
  const first = stages[0].value;
  return stages.map((stage, i) => {
    const prev = i === 0 ? stage.value : stages[i - 1].value;
    const ofFirst = first === 0 ? 0 : (stage.value / first) * 100;
    const ofPrevious =
      i === 0 ? 100 : prev === 0 ? 0 : (stage.value / prev) * 100;
    return { ofFirst, ofPrevious };
  });
};

const formatPct = (n: number): string => {
  return `${Math.round(n)}%`;
};

const ConversionFunnel = ({
  stages,
  className,
  ...props
}: Omit<React.ComponentProps<'div'>, 'children'> & {
  stages: FunnelStage[];
}) => {
  const percents = funnelPercents(stages);

  if (stages.length === 0) {
    return (
      <ChartEmpty
        data-slot="conversion-funnel"
        className={className}
        {...props}
      />
    );
  }

  return (
    <div
      data-slot="conversion-funnel"
      className={cn(
        'flex flex-col gap-3 rounded-xl bg-card p-5 ring-1 ring-foreground/10',
        'animate-in fade-in-0 duration-500 motion-reduce:animate-none',
        className,
      )}
      {...props}
    >
      {stages.map((stage, i) => {
        const { ofFirst, ofPrevious } = percents[i];
        return (
          <div
            key={`${stage.label}-${i}`}
            data-slot="funnel-stage"
            className="flex flex-col gap-1"
          >
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="font-medium text-foreground">{stage.label}</span>
              <span className="flex items-baseline gap-2">
                <span className="font-heading font-semibold tabular-nums text-foreground">
                  {stage.value.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {formatPct(ofFirst)}
                </span>
              </span>
            </div>
            <div
              role="meter"
              aria-label={`${stage.label}: ${stage.value}`}
              aria-valuenow={Math.round(ofFirst)}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-7 w-full overflow-hidden rounded-lg bg-muted"
            >
              <div
                className="flex h-full items-center rounded-lg bg-brand/80 transition-[width] duration-500"
                style={{ width: `${Math.max(ofFirst, ofFirst > 0 ? 2 : 0)}%` }}
              />
            </div>
            {i > 0 && (
              <span className="text-xs text-muted-foreground tabular-nums">
                {formatPct(ofPrevious)} of previous step
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export { ConversionFunnel };
