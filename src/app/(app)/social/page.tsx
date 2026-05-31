'use client';

import * as React from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { Camera, AtSign, Music2, Sparkles } from 'lucide-react';
import { ApprovalBar, ChatComposer, MockAIProvider } from '@/components/ai';
import { DragDropProvider, Draggable, Dropzone } from '@/components/dnd';
import {
  Badge,
  Btn,
  Grid,
  Panel,
  PanelHead,
  Pill,
  Stack,
} from '@/components/primitives';
import { Card, CardContent } from '@/components/ui/card';
import { PageError, PageLoading } from '@/components/shell/page-state';
import { useSocial } from '@/hooks/use-social';
import type {
  SocialData,
  SocialDay,
  SocialPlatform,
  SocialPost,
  SocialSlot,
} from '@/types/social';

const SLOTS: { id: SocialSlot; label: string }[] = [
  { id: 'morning', label: 'Morning' },
  { id: 'afternoon', label: 'Afternoon' },
  { id: 'evening', label: 'Evening' },
];

const DAYS: { id: SocialDay; label: string }[] = [
  { id: 'mon', label: 'Mon' },
  { id: 'tue', label: 'Tue' },
  { id: 'wed', label: 'Wed' },
  { id: 'thu', label: 'Thu' },
  { id: 'fri', label: 'Fri' },
  { id: 'sat', label: 'Sat' },
  { id: 'sun', label: 'Sun' },
];

const PLATFORM_META: Record<
  SocialPlatform,
  { label: string; Icon: typeof Camera; tone: 'primary' | 'info' | 'brand' }
> = {
  instagram: { label: 'IG', Icon: Camera, tone: 'primary' },
  facebook: { label: 'FB', Icon: AtSign, tone: 'info' },
  tiktok: { label: 'TikTok', Icon: Music2, tone: 'brand' },
};

/** Encode/decode a cell id used as the Dropzone identifier. */
const cellId = (slot: SocialSlot, day: SocialDay) => `cell:${slot}:${day}`;
function parseCell(id: string): { slot: SocialSlot; day: SocialDay } | null {
  const [tag, slot, day] = id.split(':');
  if (tag !== 'cell') return null;
  return { slot: slot as SocialSlot, day: day as SocialDay };
}

function PostCard({ post, selected }: { post: SocialPost; selected: boolean }) {
  const meta = PLATFORM_META[post.platform];
  return (
    <Card
      size="sm"
      className={selected ? 'w-full ring-2 ring-brand' : 'w-full'}
    >
      <CardContent className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <Pill tone={meta.tone}>
            <meta.Icon className="size-3" />
            {meta.label}
          </Pill>
          {post.workflow && (
            <Badge tone="brand" size="sm" title={post.workflow}>
              wf
            </Badge>
          )}
        </div>
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {post.caption}
        </p>
      </CardContent>
    </Card>
  );
}

/** Co-located weekly calendar grid built on the dnd primitives. */
function Calendar({
  posts,
  selectedId,
  onSelect,
}: {
  posts: SocialPost[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-[auto_repeat(7,minmax(7rem,1fr))] gap-2">
      <div />
      {DAYS.map((d) => (
        <div
          key={d.id}
          className="px-1 pb-1 text-center text-xs font-medium text-muted-foreground"
        >
          {d.label}
        </div>
      ))}

      {SLOTS.map((slot) => (
        <React.Fragment key={slot.id}>
          <div className="flex items-center pr-2 text-xs font-medium text-muted-foreground">
            {slot.label}
          </div>
          {DAYS.map((day) => {
            const post = posts.find(
              (p) => p.slot === slot.id && p.day === day.id,
            );
            return (
              <Dropzone
                key={cellId(slot.id, day.id)}
                id={cellId(slot.id, day.id)}
                className={
                  post
                    ? 'min-h-24 p-1.5'
                    : 'min-h-24 items-center justify-center border-dashed p-1.5'
                }
              >
                {post ? (
                  <Draggable
                    id={post.id}
                    className="cursor-grab bg-transparent p-0 ring-0"
                    onClick={() => onSelect(post.id)}
                  >
                    <div
                      className="w-full"
                      aria-label={`${post.platform} post`}
                    >
                      <PostCard post={post} selected={post.id === selectedId} />
                    </div>
                  </Draggable>
                ) : (
                  <button
                    type="button"
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-brand"
                  >
                    <Sparkles className="size-3" />+ AI suggest
                  </button>
                )}
              </Dropzone>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}

function Studio({ data }: { data: SocialData }) {
  // Cell assignments seeded from the endpoint, then owned by local state.
  const [posts, setPosts] = React.useState<SocialPost[]>(data.posts);
  const [selectedId, setSelectedId] = React.useState<string | null>(
    data.posts[0]?.id ?? null,
  );

  const selected = posts.find((p) => p.id === selectedId) ?? null;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const target = parseCell(String(over.id));
    if (!target) return;
    setPosts((prev) => {
      // Don't drop onto an occupied cell that isn't the dragged post.
      const occupied = prev.find(
        (p) =>
          p.slot === target.slot && p.day === target.day && p.id !== active.id,
      );
      if (occupied) return prev;
      return prev.map((p) =>
        p.id === active.id ? { ...p, slot: target.slot, day: target.day } : p,
      );
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Social Studio ✦
          </h2>
          <p className="text-sm text-muted-foreground">{data.weekOf}</p>
        </div>
        <Btn size="sm">+ New post</Btn>
      </div>

      <DragDropProvider onDragEnd={handleDragEnd}>
        <SortableContext
          items={posts.map((p) => p.id)}
          strategy={rectSortingStrategy}
        >
          <Grid
            cols={4}
            gap="md"
            className="max-xl:grid-cols-1 xl:grid-cols-[1fr_14rem]"
          >
            <Panel className="overflow-x-auto">
              <PanelHead
                title="Weekly calendar"
                description="Drag a post to reschedule it"
              />
              <Calendar
                posts={posts}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </Panel>

            <Panel>
              <PanelHead
                title="Priority rail"
                description="Drag a platform onto a cell"
              />
              <Stack gap="sm">
                {data.rail.map((item) => {
                  const meta = PLATFORM_META[item.platform];
                  return (
                    <Pill
                      key={item.id}
                      tone={meta.tone}
                      className="justify-start px-3 py-1.5"
                    >
                      <meta.Icon className="size-3.5" />
                      {item.label}
                    </Pill>
                  );
                })}
              </Stack>
            </Panel>
          </Grid>
        </SortableContext>
      </DragDropProvider>

      <Panel>
        <PanelHead
          title={
            selected
              ? `Selected post — ${slotLabel(selected.slot)} ${dayLabel(selected.day)}`
              : 'Selected post'
          }
          description={
            selected?.caption ?? 'Select a post on the calendar to edit it.'
          }
        />

        {selected && (
          <MockAIProvider tokens={data.aiTokens} delay={40}>
            <div className="flex flex-col gap-4">
              <ChatComposer
                placeholder="make this more playful…"
                defaultValue="Make this more playful"
              />

              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  AI variations
                </span>
                <Grid cols={3} gap="sm" className="max-md:grid-cols-1">
                  {data.variations.map((v) => (
                    <Card key={v.id} size="sm">
                      <CardContent className="flex flex-col gap-2">
                        <Pill tone="brand">{v.tone}</Pill>
                        <p className="text-xs text-muted-foreground">
                          {v.text}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </Grid>
              </div>

              <ApprovalBar
                value={data.variations[0]?.text ?? selected.caption}
              />
            </div>
          </MockAIProvider>
        )}
      </Panel>
    </div>
  );
}

const slotLabel = (slot: SocialSlot) =>
  SLOTS.find((s) => s.id === slot)?.label ?? slot;
const dayLabel = (day: SocialDay) =>
  DAYS.find((d) => d.id === day)?.label ?? day;

export default function SocialPage() {
  const { data, isLoading, isError } = useSocial();

  if (isLoading) return <PageLoading label="Loading Social Studio…" />;
  if (isError || !data)
    return <PageError message="Couldn't load Social Studio." />;

  return <Studio data={data.data} />;
}
