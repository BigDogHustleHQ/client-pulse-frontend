'use client';

import * as React from 'react';
import { Check, Pencil, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ApprovalBarProps = Omit<React.ComponentProps<'div'>, 'onChange'> & {
  /** The draft content awaiting sign-off. */
  value: string;
  /** Fires with the (possibly edited) value when approved. */
  onApprove?: (value: string) => void;
  /** Fires with the new value after editing and saving. */
  onEdit?: (value: string) => void;
  /** Fires when rejected, optionally with a reason. */
  onReject?: (reason?: string) => void;
};

function ApprovalBar({
  value,
  onApprove,
  onEdit,
  onReject,
  className,
  ...props
}: ApprovalBarProps) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);

  // Sync the local draft when the incoming value changes while not editing.
  // Adjusting state during render (vs. an effect) avoids an extra commit.
  const [prevValue, setPrevValue] = React.useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    if (!editing) setDraft(value);
  }

  function handleSave() {
    setEditing(false);
    onEdit?.(draft);
  }

  function handleCancel() {
    setDraft(value);
    setEditing(false);
  }

  if (editing) {
    return (
      <div
        data-slot="approval-bar"
        data-editing="true"
        className={cn(
          'animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-2 motion-reduce:animate-none',
          className,
        )}
        {...props}
      >
        <textarea
          data-slot="approval-bar-editor"
          aria-label="Edit draft"
          rows={4}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="w-full resize-y rounded-lg border border-border bg-background p-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button type="button" size="sm" onClick={handleSave}>
            <Check />
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      data-slot="approval-bar"
      className={cn('flex items-center justify-end gap-2', className)}
      {...props}
    >
      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={() => onReject?.()}
      >
        <X />
        Reject
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setEditing(true)}
      >
        <Pencil />
        Edit
      </Button>
      <Button type="button" size="sm" onClick={() => onApprove?.(value)}>
        <Check />
        Approve
      </Button>
    </div>
  );
}

export { ApprovalBar };
