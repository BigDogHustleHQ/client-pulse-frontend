'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const DEFAULT_STOPS = ['Professional', 'Friendly', 'Casual'] as const;

export type ToneSliderProps = Omit<
  React.ComponentProps<'input'>,
  'value' | 'onChange' | 'type' | 'min' | 'max'
> & {
  /** Controlled value across the range. */
  value: number;
  /** Fires with the new numeric value. */
  onChange: (value: number) => void;
  /** Minimum value (default 0). */
  min?: number;
  /** Maximum value (default 100). */
  max?: number;
  /** Ordered tone labels mapped across the range. */
  stops?: readonly string[];
  /** Visible field label. */
  label?: string;
};

const labelFor = (
  value: number,
  min: number,
  max: number,
  stops: readonly string[],
) => {
  const span = max - min || 1;
  const ratio = Math.min(1, Math.max(0, (value - min) / span));
  const index = Math.round(ratio * (stops.length - 1));
  return stops[index];
};

const ToneSlider = ({
  value,
  onChange,
  min = 0,
  max = 100,
  stops = DEFAULT_STOPS,
  label = 'Tone',
  className,
  id,
  ...props
}: ToneSliderProps) => {
  const reactId = React.useId();
  const inputId = id ?? reactId;
  const currentLabel = labelFor(value, min, max, stops);

  return (
    <div
      data-slot="tone-slider"
      className={cn('flex flex-col gap-2', className)}
    >
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-foreground"
        >
          {label}
        </label>
        <span
          data-slot="tone-slider-value"
          className="text-sm font-medium text-brand transition-colors duration-200 motion-reduce:transition-none"
        >
          {currentLabel}
        </span>
      </div>
      <input
        id={inputId}
        type="range"
        data-slot="tone-slider-input"
        min={min}
        max={max}
        value={value}
        aria-label={label}
        aria-valuetext={currentLabel}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-brand outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        {...props}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        {stops.map((stop) => (
          <span key={stop}>{stop}</span>
        ))}
      </div>
    </div>
  );
};

export { ToneSlider };
