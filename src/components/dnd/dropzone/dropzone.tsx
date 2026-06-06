'use client';

import * as React from 'react';
import type { UniqueIdentifier } from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

type DropzoneProps = Omit<React.ComponentProps<'div'>, 'id'> & {
  id: UniqueIdentifier;
};

// Droppable container. Used both as a list container and for free-positioned
// boards. Shows a dashed highlight hint while a draggable is over it.
const Dropzone = ({ id, children, className, ...props }: DropzoneProps) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      data-slot="dropzone"
      data-over={isOver || undefined}
      className={cn(
        'flex flex-col gap-2 rounded-xl border border-border p-3 transition-colors duration-200 ease-out motion-reduce:transition-none',
        isOver && 'border-2 border-dashed border-brand bg-brand/15',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { Dropzone };
export type { DropzoneProps };
