'use client';

import * as React from 'react';
import { Star } from 'lucide-react';
import {
  AIReplyDraft,
  DraftStatus,
  MockAIProvider,
  ToneSlider,
  type DraftResolution,
} from '@/components/ai';
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
import type { InboxChannel, InboxChannelId, InboxData } from '@/types/inbox';

export default function InboxPage() {
  const { data, isLoading, isError } = useInbox();

  const inbox = data?.data;

  // Hold the selected channel in local state, seeded from the mock. Sync during
  // render when a fresh payload arrives (the pattern vendors/page.tsx uses) so
  // the default selected channel survives without a flicker effect.
  const seededId = inbox?.selectedChannelId;
  const [selectedChannelId, setSelectedChannelId] =
    React.useState<InboxChannelId | null>(seededId ?? null);
  const [prevSeededId, setPrevSeededId] = React.useState(seededId);
  if (seededId && seededId !== prevSeededId) {
    setPrevSeededId(seededId);
    setSelectedChannelId(seededId);
  }

  if (isLoading) return <PageLoading label="Loading your inbox…" />;
  if (isError || !inbox) return <PageError message="Couldn't load Inbox." />;

  const selectedChannel =
    inbox.channels.find((c) => c.id === selectedChannelId) ??
    inbox.channels.find((c) => c.id === inbox.selectedChannelId) ??
    inbox.channels[0];

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
        <ChannelList
          inbox={inbox}
          selectedChannelId={selectedChannel.id}
          onSelect={setSelectedChannelId}
        />
        <div className="lg:col-span-2">
          <Thread
            key={selectedChannel.id}
            channel={selectedChannel}
            threshold={inbox.threshold}
          />
        </div>
      </div>
    </div>
  );
}

function ChannelList({
  inbox,
  selectedChannelId,
  onSelect,
}: {
  inbox: InboxData;
  selectedChannelId: InboxChannelId;
  onSelect: (id: InboxChannelId) => void;
}) {
  const columns: MiniTableColumn<InboxChannel>[] = [
    {
      key: 'label',
      header: 'Channel',
      render: (c) => (
        <span
          className={
            c.id === selectedChannelId
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
          tone={c.id === selectedChannelId ? 'brand' : 'neutral'}
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
        onRowClick={(c) => onSelect(c.id)}
        isRowSelected={(c) => c.id === selectedChannelId}
        empty="No channels"
      />
    </Panel>
  );
}

function Thread({
  channel,
  threshold,
}: {
  channel: InboxChannel;
  threshold: number;
}) {
  const msg = channel.message;
  const reply = channel.reply;

  const [tone, setTone] = React.useState(50);
  const [resolution, setResolution] = React.useState<DraftResolution | null>(
    null,
  );

  const belowThreshold = reply.confidence < threshold;
  const canAutoSend = !belowThreshold && Boolean(channel.autoSend);

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
          {resolution ? (
            <Panel>
              <DraftStatus
                resolution={resolution}
                onUndo={() => setResolution(null)}
              />
            </Panel>
          ) : (
            <AIReplyDraft
              prompt={reply.prompt}
              confidence={reply.confidence}
              onApprove={() => setResolution('approved')}
              onReject={() => setResolution('rejected')}
            />
          )}
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
                {channel.label} allows auto-send — this reply can send
                automatically.
              </>
            ) : (
              <>
                Above the {Math.round(threshold * 100)}% threshold, but{' '}
                {channel.label} requires manual approval.
              </>
            )}
          </p>
        </Inline>
      </Panel>
    </Stack>
  );
}
