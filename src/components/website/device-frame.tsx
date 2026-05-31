'use client';

import { Monitor, Smartphone, Tablet } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DeviceId = 'desktop' | 'tablet' | 'mobile';

export type DeviceSpec = {
  id: DeviceId;
  label: string;
  /** Logical viewport width in px the preview iframe simulates. */
  width: number;
};

export const DEVICES: DeviceSpec[] = [
  { id: 'desktop', label: 'Desktop', width: 1280 },
  { id: 'tablet', label: 'Tablet', width: 768 },
  { id: 'mobile', label: 'Mobile', width: 390 },
];

const ICON = {
  desktop: Monitor,
  tablet: Tablet,
  mobile: Smartphone,
} as const;

/** Segmented Desktop / Tablet / Mobile toggle for the preview canvas. */
export function DeviceToggle({
  value,
  onChange,
}: {
  value: DeviceId;
  onChange: (device: DeviceId) => void;
}) {
  return (
    <div
      data-slot="device-toggle"
      role="radiogroup"
      aria-label="Preview device"
      className="inline-flex gap-1 rounded-lg bg-secondary p-1"
    >
      {DEVICES.map((device) => {
        const Icon = ICON[device.id];
        const selected = device.id === value;
        return (
          <button
            key={device.id}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={device.label}
            data-device={device.id}
            onClick={() => onChange(device.id)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-all duration-200 active:scale-[0.97] motion-reduce:transition-none motion-reduce:transform-none',
              selected
                ? 'bg-card text-foreground ring-1 ring-foreground/10'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="size-4" />
            <span className="max-sm:sr-only">{device.label}</span>
          </button>
        );
      })}
    </div>
  );
}
