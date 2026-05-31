'use client';

import * as React from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMockAI } from '../mock-ai-provider/mock-ai-provider';

export type ChatComposerProps = Omit<
  React.ComponentProps<'form'>,
  'onSubmit'
> & {
  /** Controlled prompt value. */
  value?: string;
  /** Default prompt value (uncontrolled). */
  defaultValue?: string;
  /** Fires on every prompt change. */
  onValueChange?: (value: string) => void;
  /** Placeholder for the prompt textarea. */
  placeholder?: string;
  /** Fires once a full streamed response has been received. */
  onResponse?: (response: string) => void;
};

function ChatComposer({
  value,
  defaultValue = '',
  onValueChange,
  placeholder = 'Ask the AI to draft something…',
  onResponse,
  className,
  ...props
}: ChatComposerProps) {
  const { stream } = useMockAI();
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const prompt = isControlled ? value : internal;

  const [response, setResponse] = React.useState('');
  const [streaming, setStreaming] = React.useState(false);

  function setPrompt(next: string) {
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (streaming || prompt.trim() === '') return;

    setStreaming(true);
    setResponse('');
    let out = '';
    for await (const token of stream(prompt)) {
      out += token;
      setResponse(out);
    }
    setStreaming(false);
    onResponse?.(out);
  }

  return (
    <form
      data-slot="chat-composer"
      onSubmit={handleSubmit}
      className={cn('flex flex-col gap-3', className)}
      {...props}
    >
      <div className="flex items-end gap-2 rounded-xl border border-border bg-card p-2">
        <textarea
          data-slot="chat-composer-input"
          aria-label="Prompt"
          rows={2}
          value={prompt}
          placeholder={placeholder}
          disabled={streaming}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 resize-none bg-transparent px-1.5 py-1 text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-50"
        />
        <Button
          type="submit"
          size="icon"
          disabled={streaming || prompt.trim() === ''}
        >
          {streaming ? <Sparkles className="animate-pulse" /> : <Send />}
          <span className="sr-only">Send</span>
        </Button>
      </div>

      {(streaming || response) && (
        <div
          data-slot="chat-composer-response"
          aria-live="polite"
          className="animate-in fade-in slide-in-from-bottom-1 duration-300 rounded-xl bg-secondary/60 p-3 text-sm text-secondary-foreground motion-reduce:animate-none"
        >
          {response}
          {streaming && (
            <span
              data-slot="chat-composer-streaming"
              className="ml-1 inline-flex items-center gap-1 align-middle text-xs text-muted-foreground"
            >
              <Sparkles className="size-3 animate-pulse" />
              streaming…
            </span>
          )}
        </div>
      )}
    </form>
  );
}

export { ChatComposer };
