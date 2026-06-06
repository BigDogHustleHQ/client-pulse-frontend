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
  /** Fires with the snapped value once an adjustment is committed. */
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

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

// Index of the nearest stop for a raw value.
const stopIndexFor = (
  value: number,
  min: number,
  max: number,
  stops: readonly string[],
) => {
  const span = max - min || 1;
  return Math.round(clamp01((value - min) / span) * (stops.length - 1));
};

const labelFor = (
  value: number,
  min: number,
  max: number,
  stops: readonly string[],
) => stops[stopIndexFor(value, min, max, stops)];

// Exact value at a given stop index.
const valueAtIndex = (
  index: number,
  min: number,
  max: number,
  stops: readonly string[],
) =>
  stops.length <= 1 ? min : min + (index * (max - min)) / (stops.length - 1);

// Snap a raw value to its nearest stop's exact position.
const snapToStop = (
  value: number,
  min: number,
  max: number,
  stops: readonly string[],
) => valueAtIndex(stopIndexFor(value, min, max, stops), min, max, stops);

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

  // `display` drives the thumb position. It follows the cursor freely while
  // dragging; on release it animates to the snapped stop. While idle, it stays
  // in sync with the controlled `value` — done via the React-recommended
  // store-prev-during-render pattern (no effect, no cascade).
  const [display, setDisplay] = React.useState(value);
  const [dragging, setDragging] = React.useState(false);
  const [prevValue, setPrevValue] = React.useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    if (!dragging) setDisplay(value);
  }

  const currentLabel = labelFor(display, min, max, stops);
  const pct = clamp01((display - (min || 0)) / (max - min || 1)) * 100;

  const commit = () => {
    if (!dragging) return;
    const snapped = snapToStop(display, min, max, stops);
    setDragging(false);
    setDisplay(snapped); // transition re-enables → smooth glide to the stop
    onChange(snapped);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (stops.length <= 1) return;
    const index = stopIndexFor(display, min, max, stops);
    let next = index;
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        next = index - 1;
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        next = index + 1;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = stops.length - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    next = Math.min(stops.length - 1, Math.max(0, next));
    const nextValue = valueAtIndex(next, min, max, stops);
    setDragging(false);
    setDisplay(nextValue);
    onChange(nextValue);
  };

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

      <div className="relative flex h-4 items-center">
        <div
          data-slot="tone-slider-track"
          aria-hidden="true"
          className="h-2 w-full rounded-full bg-secondary"
        />
        <input
          id={inputId}
          type="range"
          data-slot="tone-slider-input"
          min={min}
          max={max}
          value={display}
          aria-label={label}
          aria-valuetext={currentLabel}
          onChange={(e) => {
            setDragging(true);
            setDisplay(Number(e.target.value));
          }}
          onPointerUp={commit}
          onPointerCancel={commit}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          className="peer absolute inset-0 size-full cursor-pointer appearance-none bg-transparent opacity-0 outline-none"
          {...props}
        />
        <span
          data-slot="tone-slider-thumb"
          aria-hidden="true"
          style={{ left: `${pct}%` }}
          className={cn(
            'pointer-events-none absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand shadow-sm',
            'peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50',
            !dragging &&
              'transition-[left] duration-200 ease-out motion-reduce:transition-none',
          )}
        />
      </div>

      <div className="flex justify-between text-xs text-muted-foreground">
        {stops.map((stop) => (
          <span key={stop}>{stop}</span>
        ))}
      </div>
    </div>
  );
};

export { ToneSlider };
