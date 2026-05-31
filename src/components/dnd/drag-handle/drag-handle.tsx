'use client';

import * as React from 'react';
import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from '@dnd-kit/core';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

type DragHandleProps = React.ComponentProps<'button'> & {
  // dnd-kit's useSortable returns `listeners` and `attributes` to spread here.
  listeners?: DraggableSyntheticListeners;
  attributes?: Partial<DraggableAttributes>;
};

// The ⋮⋮ grip button. Spread dnd-kit `attributes`/`listeners` onto it to wire
// up dragging. Defaults to an accessible "Drag to reorder" label.
function DragHandle({
  className,
  listeners,
  attributes,
  'aria-label': ariaLabel = 'Drag to reorder',
  ...props
}: DragHandleProps) {
  return (
    <button
      type="button"
      data-slot="drag-handle"
      aria-label={ariaLabel}
      className={cn(
        'inline-flex size-7 shrink-0 cursor-grab touch-none items-center justify-center rounded-lg text-muted-foreground transition-[transform,background-color,color] duration-200 ease-out hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/20 focus-visible:outline-none active:scale-95 active:cursor-grabbing motion-reduce:transition-none motion-reduce:transform-none',
        className,
      )}
      {...attributes}
      {...listeners}
      {...props}
    >
      <GripVertical className="size-4" aria-hidden="true" />
    </button>
  );
}

export { DragHandle };
export type { DragHandleProps };
