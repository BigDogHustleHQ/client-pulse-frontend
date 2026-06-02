'use client';

import * as React from 'react';
import { Sparkles } from 'lucide-react';
import { Panel, PanelHead, Pill } from '@/components/primitives';
import { cn } from '@/lib/utils';
import {
  ApprovalBar,
  type ApprovalBarProps,
} from '../approval-bar/approval-bar';
import { useMockAI } from '../mock-ai-provider/mock-ai-provider';

const confidenceTone = (
  confidence: number,
): 'success' | 'warning' | 'danger' => {
  if (confidence >= 0.8) return 'success';
  if (confidence >= 0.5) return 'warning';
  return 'danger';
};

export type AIReplyDraftProps = Omit<
  React.ComponentProps<'section'>,
  'onChange' | 'title'
> & {
  /** Prompt sent to the mock AI to generate the draft. */
  prompt: string;
  /** 0..1 confidence score driving the indicator. */
  confidence?: number;
  /** Title shown in the panel head. */
  title?: React.ReactNode;
  /** Generate the draft eagerly on mount. Defaults to true. */
  autoDraft?: boolean;
  onApprove?: ApprovalBarProps['onApprove'];
  onEdit?: ApprovalBarProps['onEdit'];
  onReject?: ApprovalBarProps['onReject'];
};

const AIReplyDraft = ({
  prompt,
  confidence = 0.92,
  title = 'AI-drafted reply',
  autoDraft = true,
  onApprove,
  onEdit,
  onReject,
  className,
  ...props
}: AIReplyDraftProps) => {
  const { complete } = useMockAI();
  // Track which prompt the current draft belongs to so `loading` can be
  // derived rather than set synchronously inside the effect.
  const [drafted, setDrafted] = React.useState<{
    prompt: string;
    text: string;
  } | null>(null);

  React.useEffect(() => {
    if (!autoDraft) return;
    let active = true;
    complete(prompt).then((text) => {
      if (active) setDrafted({ prompt, text });
    });
    return () => {
      active = false;
    };
  }, [autoDraft, complete, prompt]);

  const isCurrent = drafted?.prompt === prompt;
  const loading = autoDraft && !isCurrent;
  const draft = isCurrent ? drafted.text : '';
  const setDraft = (text: string) => setDrafted({ prompt, text });

  const tone = confidenceTone(confidence);
  const pct = Math.round(confidence * 100);

  return (
    <Panel data-slot="ai-reply-draft" className={cn(className)} {...props}>
      <PanelHead
        actions={
          <Pill tone={tone} data-slot="ai-reply-draft-confidence">
            {pct}% confident
          </Pill>
        }
      >
        <h3 className="inline-flex items-center gap-1.5 font-heading text-base leading-snug font-medium">
          <Sparkles className="size-4 text-brand" />
          {title}
        </h3>
      </PanelHead>

      <p
        data-slot="ai-reply-draft-body"
        aria-live="polite"
        className="rounded-lg bg-secondary/50 p-3 text-sm whitespace-pre-wrap text-foreground"
      >
        <span
          key={loading ? 'loading' : 'drafted'}
          className="animate-in fade-in duration-300 motion-reduce:animate-none"
        >
          {loading ? 'Drafting…' : draft}
        </span>
      </p>

      <ApprovalBar
        value={draft}
        onApprove={onApprove}
        onEdit={(next) => {
          setDraft(next);
          onEdit?.(next);
        }}
        onReject={onReject}
      />
    </Panel>
  );
};

export { AIReplyDraft, confidenceTone };
