'use client';

import * as React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { WidgetSize } from './types';

const sizeClass: Record<WidgetSize, string> = {
  sm: 'lg:col-span-1',
  md: 'lg:col-span-1',
  lg: 'lg:col-span-2',
};

/**
 * Wraps a single rendered widget. In edit mode it exposes a keyboard-accessible
 * drag handle (dnd-kit `useSortable`) and a remove control. Pure presentation
 * widgets render their own `Panel`/`KPI`, so the frame is an unstyled grid cell
 * plus the edit affordances.
 */
export function WidgetFrame({
  id,
  size,
  label,
  editing,
  onRemove,
  children,
}: {
  id: string;
  size: WidgetSize;
  label: string;
  editing: boolean;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !editing });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      data-slot="widget"
      data-widget-id={id}
      data-editing={editing || undefined}
      style={style}
      className={cn(
        'relative min-w-0',
        sizeClass[size],
        editing &&
          'rounded-xl ring-2 ring-foreground/15 ring-offset-2 ring-offset-background',
        isDragging && 'z-10 opacity-60',
      )}
    >
      {editing && (
        <div className="absolute -top-3 right-2 z-20 flex items-center gap-1">
          <Button
            ref={setActivatorNodeRef}
            type="button"
            variant="secondary"
            size="icon-sm"
            data-slot="widget-drag-handle"
            aria-label={`Reorder ${label}`}
            className="cursor-grab touch-none active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical />
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="icon-sm"
            data-slot="widget-remove"
            aria-label={`Remove ${label}`}
            onClick={onRemove}
          >
            <X />
          </Button>
        </div>
      )}
      {children}
    </div>
  );
}
