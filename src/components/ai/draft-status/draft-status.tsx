'use client';

import * as React from 'react';
import { Check, Undo2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/** The terminal state of an AI draft after the owner signs off on it. */
export type DraftResolution = 'approved' | 'rejected';

export type DraftStatusProps = Omit<React.ComponentProps<'div'>, 'children'> & {
  /** Whether the draft was approved or rejected. */
  resolution: DraftResolution;
  /** Message shown when approved. */
  approvedLabel?: React.ReactNode;
  /** Message shown when rejected. */
  rejectedLabel?: React.ReactNode;
  /** When provided, renders an Undo control that fires this. */
  onUndo?: () => void;
};

const DraftStatus = ({
  resolution,
  approvedLabel = 'Reply approved — queued to send',
  rejectedLabel = 'Draft dismissed',
  onUndo,
  className,
  ...props
}: DraftStatusProps) => {
  const approved = resolution === 'approved';

  return (
    <div
      data-slot="draft-status"
      data-resolution={resolution}
      role="status"
      className={cn(
        'flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm',
        'animate-in fade-in slide-in-from-top-1 duration-300 ease-out motion-reduce:animate-none',
        approved
          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
          : 'bg-muted text-muted-foreground',
        className,
      )}
      {...props}
    >
      <span className="flex items-center gap-2 font-medium">
        {approved ? (
          <Check className="size-4 shrink-0" aria-hidden="true" />
        ) : (
          <X className="size-4 shrink-0" aria-hidden="true" />
        )}
        {approved ? approvedLabel : rejectedLabel}
      </span>
      {onUndo && (
        <Button type="button" variant="ghost" size="sm" onClick={onUndo}>
          <Undo2 className="size-3.5" />
          Undo
        </Button>
      )}
    </div>
  );
};

export { DraftStatus };
