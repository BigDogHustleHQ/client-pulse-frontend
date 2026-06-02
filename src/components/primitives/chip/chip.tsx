'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Chip = ({
  className,
  children,
  leading,
  onRemove,
  removeLabel = 'Remove',
  ...props
}: React.ComponentProps<'span'> & {
  leading?: React.ReactNode;
  onRemove?: () => void;
  removeLabel?: string;
}) => {
  return (
    <span
      data-slot="chip"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary py-1 pr-1 pl-2.5 text-sm text-secondary-foreground transition-colors motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      {leading}
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          aria-label={removeLabel}
          onClick={onRemove}
          className="grid size-4 place-content-center rounded-full text-muted-foreground transition-[transform,background-color,color] hover:bg-foreground/10 hover:text-foreground active:scale-90 motion-reduce:transition-none motion-reduce:active:scale-100"
        >
          <X className="size-3" />
        </button>
      )}
    </span>
  );
};

export { Chip };
