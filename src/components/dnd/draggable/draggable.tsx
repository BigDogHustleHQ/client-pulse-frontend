'use client';

import * as React from 'react';
import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
  UniqueIdentifier,
} from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { DragHandle } from '../drag-handle/drag-handle';

type DragHandleRenderProps = {
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners;
};

type DraggableProps = Omit<React.ComponentProps<'div'>, 'id' | 'children'> & {
  id: UniqueIdentifier;
  // When children is a function it receives the handle props so consumers can
  // place the DragHandle anywhere. Otherwise a default handle is rendered.
  children?:
    | React.ReactNode
    | ((props: DragHandleRenderProps) => React.ReactNode);
};

// Sortable item. Wraps useSortable, applies transform/transition, exposes a
// grabbing state, and either renders a default DragHandle or hands the handle
// props to a children render-prop for flexible placement.
const Draggable = ({
  id,
  children,
  className,
  style,
  ...props
}: DraggableProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  });

  const composedStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...style,
  };

  return (
    <div
      ref={setNodeRef}
      data-slot="draggable"
      data-dragging={isDragging || undefined}
      style={composedStyle}
      className={cn(
        'flex items-center gap-2 rounded-xl bg-card p-3 text-card-foreground ring-1 ring-foreground/10 transition-shadow duration-200 ease-out motion-reduce:transition-none',
        isDragging && 'z-10 opacity-60 shadow-lg ring-brand/40',
        className,
      )}
      {...props}
    >
      {typeof children === 'function' ? (
        children({ attributes, listeners })
      ) : (
        <>
          <DragHandle attributes={attributes} listeners={listeners} />
          {children}
        </>
      )}
    </div>
  );
};

export { Draggable };
export type { DraggableProps, DragHandleRenderProps };
