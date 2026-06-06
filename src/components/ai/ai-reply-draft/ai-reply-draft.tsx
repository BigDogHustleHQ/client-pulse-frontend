'use client';

import * as React from 'react';
import { Check, RefreshCw, Send, Sparkles } from 'lucide-react';
import { Panel, PanelHead } from '@/components/primitives';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMockAI } from '../mock-ai-provider/mock-ai-provider';

export type AIReplyDraftProps = Omit<
  React.ComponentProps<'section'>,
  'onChange' | 'onSubmit' | 'title'
> & {
  /** Prompt sent to the mock AI to generate the draft. */
  prompt: string;
  /** Title shown in the panel head. */
  title?: React.ReactNode;
  /** Generate the draft eagerly on mount. Defaults to true. */
  autoDraft?: boolean;
  /** Fires with the current textbox contents when submitted. */
  onSubmit?: (value: string) => void;
  /** Fires with the new value whenever the user edits the draft inline. */
  onChange?: (value: string) => void;
  /** Fires when a fresh draft is requested via the refresh control. */
  onRegenerate?: () => void;
};

const AIReplyDraft = ({
  prompt,
  title = 'AI-drafted reply',
  autoDraft = true,
  onSubmit,
  onChange,
  onRegenerate,
  className,
  ...props
}: AIReplyDraftProps) => {
  const { complete } = useMockAI();
  // `nonce` lets "Regenerate" re-run the same prompt. The drafted record is
  // keyed by (prompt, nonce) so `loading` can be derived from the latest
  // request rather than set imperatively inside the effect.
  const [nonce, setNonce] = React.useState(0);
  const [drafted, setDrafted] = React.useState<{
    prompt: string;
    nonce: number;
    text: string;
  } | null>(null);

  React.useEffect(() => {
    if (!autoDraft) return;
    let active = true;
    complete(prompt).then((text) => {
      if (active) setDrafted({ prompt, nonce, text });
    });
    return () => {
      active = false;
    };
  }, [autoDraft, complete, prompt, nonce]);

  const isCurrent = drafted?.prompt === prompt && drafted?.nonce === nonce;
  const loading = autoDraft && !isCurrent;
  const draft = isCurrent ? drafted.text : '';

  const handleChange = (text: string) => {
    setDrafted({ prompt, nonce, text });
    onChange?.(text);
  };

  const handleRegenerate = () => {
    // Bumping the nonce invalidates `isCurrent` → derives loading + re-runs the
    // effect to fetch a fresh draft.
    setNonce((n) => n + 1);
    onRegenerate?.();
  };

  // Self-contained "sent" feedback: the Send icon launches off and a check
  // lands in its place, then the button resets so it stays reusable.
  const [sent, setSent] = React.useState(false);
  const sentTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => {
    return () => {
      if (sentTimer.current) clearTimeout(sentTimer.current);
    };
  }, []);

  const handleSubmit = () => {
    onSubmit?.(draft);
    // Clear the textbox once submitted; the draft has been sent off.
    setDrafted({ prompt, nonce, text: '' });
    setSent(true);
    if (sentTimer.current) clearTimeout(sentTimer.current);
    sentTimer.current = setTimeout(() => setSent(false), 1400);
  };

  return (
    <Panel data-slot="ai-reply-draft" className={cn(className)} {...props}>
      <PanelHead>
        <h3 className="inline-flex items-center gap-1.5 font-heading text-base leading-snug font-medium">
          <Sparkles className="size-4 text-brand" />
          {title}
        </h3>
      </PanelHead>

      <textarea
        data-slot="ai-reply-draft-editor"
        aria-label="AI-drafted reply"
        aria-busy={loading}
        rows={4}
        value={loading ? '' : draft}
        placeholder={loading ? 'Drafting…' : undefined}
        disabled={loading}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full resize-y rounded-lg border border-border bg-background p-3 text-sm whitespace-pre-wrap text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-70"
      />

      <div className="flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleRegenerate}
          disabled={loading}
        >
          <RefreshCw
            className={cn(loading && 'animate-spin motion-reduce:animate-none')}
          />
          Regenerate
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={handleSubmit}
          disabled={loading || sent || draft.trim() === ''}
        >
          <span className="relative inline-flex size-3.5 items-center justify-center">
            <Send
              aria-hidden
              className={cn(
                'absolute transition-opacity duration-200',
                sent && 'opacity-0 motion-safe:animate-plane-launch',
              )}
            />
            <Check
              aria-hidden
              className={cn(
                'absolute opacity-0 transition-opacity duration-300',
                sent && 'opacity-100 motion-safe:animate-plane-land',
              )}
            />
          </span>
          {sent ? 'Sent' : 'Submit'}
        </Button>
      </div>
    </Panel>
  );
};

export { AIReplyDraft };
