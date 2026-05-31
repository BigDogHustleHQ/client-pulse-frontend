'use client';

import * as React from 'react';
import { Star } from 'lucide-react';
import { AIReplyDraft, MockAIProvider, ToneSlider } from '@/components/ai';
import {
  Badge,
  Inline,
  MiniTable,
  Panel,
  PanelHead,
  Pill,
  Stack,
  type MiniTableColumn,
} from '@/components/primitives';
import { PageError, PageLoading } from '@/components/shell/page-state';
import { useInbox } from '@/hooks/use-inbox';
import type { InboxChannel, InboxData } from '@/types/inbox';

export default function InboxPage() {
  const { data, isLoading, isError } = useInbox();

  if (isLoading) return <PageLoading label="Loading your inbox…" />;
  if (isError || !data) return <PageError message="Couldn't load Inbox." />;

  const inbox = data.data;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          Inbox
        </h2>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Reviews, DMs, SMS, and email in one place. Each message gets an
          AI-drafted reply you can approve, edit, or reject.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ChannelList inbox={inbox} />
        <div className="lg:col-span-2">
          <Thread inbox={inbox} />
        </div>
      </div>
    </div>
  );
}

function ChannelList({ inbox }: { inbox: InboxData }) {
  const columns: MiniTableColumn<InboxChannel>[] = [
    {
      key: 'label',
      header: 'Channel',
      render: (c) => (
        <span
          className={
            c.id === inbox.selectedChannelId
              ? 'font-medium text-brand'
              : 'text-foreground'
          }
        >
          {c.label}
        </span>
      ),
    },
    {
      key: 'tone',
      header: 'Tone',
      render: (c) => <Pill tone="neutral">{c.tone}</Pill>,
    },
    {
      key: 'count',
      header: 'Count',
      align: 'right',
      render: (c) => (
        <Badge
          tone={c.id === inbox.selectedChannelId ? 'brand' : 'neutral'}
          count={c.count}
        />
      ),
    },
  ];

  return (
    <Panel>
      <PanelHead title="Channels" description="Unified across every source" />
      <MiniTable
        columns={columns}
        data={inbox.channels}
        rowKey={(c) => c.id}
        empty="No channels"
      />
    </Panel>
  );
}

function Thread({ inbox }: { inbox: InboxData }) {
  const msg = inbox.selectedMessage;
  const { reply, threshold } = inbox;
  const channel = inbox.channels.find((c) => c.id === msg.channelId);

  const [tone, setTone] = React.useState(50);

  const belowThreshold = reply.confidence < threshold;
  const canAutoSend = !belowThreshold && Boolean(channel?.autoSend);

  return (
    <Stack gap="md">
      <Panel>
        <PanelHead actions={<Pill tone={msg.sourceTone}>{msg.source}</Pill>}>
          <div className="flex flex-col gap-1">
            {msg.rating !== undefined && (
              <span
                className="flex items-center gap-0.5"
                aria-label={`${msg.rating} of 5 stars`}
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={
                      i < msg.rating!
                        ? 'size-3.5 fill-amber-400 text-amber-400'
                        : 'size-3.5 text-muted-foreground/40'
                    }
                  />
                ))}
              </span>
            )}
            <h3 className="font-heading text-base leading-snug font-medium">
              {msg.sender}
            </h3>
          </div>
        </PanelHead>
        <p className="text-sm whitespace-pre-wrap text-foreground">
          {msg.body}
        </p>
        <p className="text-xs text-muted-foreground">{msg.receivedAt}</p>
      </Panel>

      <MockAIProvider tokens={[reply.draft]} delay={0}>
        <Stack gap="sm">
          <AIReplyDraft prompt={reply.prompt} confidence={reply.confidence} />
          <Panel>
            <ToneSlider value={tone} onChange={setTone} label="Reply tone" />
          </Panel>
        </Stack>
      </MockAIProvider>

      <Panel
        className={belowThreshold ? 'ring-amber-500/30' : 'ring-emerald-500/30'}
      >
        <Inline gap="sm" className="items-start">
          <Pill tone={belowThreshold ? 'warning' : 'success'}>
            {Math.round(reply.confidence * 100)}% confident
          </Pill>
          <p className="text-sm text-muted-foreground">
            {belowThreshold ? (
              <>
                Below the {Math.round(threshold * 100)}% threshold — this draft
                needs owner review before it can be sent.
              </>
            ) : canAutoSend ? (
              <>
                Above the {Math.round(threshold * 100)}% threshold and{' '}
                {channel?.label} allows auto-send — this reply can send
                automatically.
              </>
            ) : (
              <>
                Above the {Math.round(threshold * 100)}% threshold, but{' '}
                {channel?.label} requires manual approval.
              </>
            )}
          </p>
        </Inline>
      </Panel>
    </Stack>
  );
}
