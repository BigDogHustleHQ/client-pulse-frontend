'use client';

import * as React from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { Camera, AtSign, Music2, Sparkles } from 'lucide-react';
import {
  ApprovalBar,
  ChatComposer,
  DraftStatus,
  MockAIProvider,
  type DraftResolution,
} from '@/components/ai';
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageError, PageLoading } from '@/components/shell/page-state';
import { cn } from '@/lib/utils';
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

const PLATFORMS: { id: SocialPlatform; label: string }[] = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'tiktok', label: 'TikTok' },
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

/** Shared native-select styling so the create form matches the Input look. */
const selectClass =
  'h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30';

function PostCard({ post, selected }: { post: SocialPost; selected: boolean }) {
  const meta = PLATFORM_META[post.platform];
  return (
    <Card
      size="sm"
      className={cn(
        'w-full min-w-0 transition-all duration-200 motion-reduce:transition-none',
        selected && 'ring-2 ring-brand',
      )}
    >
      <CardContent className="flex min-w-0 flex-col gap-1.5">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <Pill tone={meta.tone} className="min-w-0">
            <meta.Icon className="size-3 shrink-0" />
            <span className="truncate">{meta.label}</span>
          </Pill>
          {post.workflow && (
            <Badge tone="brand" size="sm" title={post.workflow}>
              wf
            </Badge>
          )}
        </div>
        <p className="line-clamp-2 min-w-0 text-xs text-muted-foreground">
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
    <div className="grid min-w-[44rem] grid-cols-[auto_repeat(7,minmax(7rem,1fr))] gap-2">
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
                    ? 'min-h-24 min-w-0 p-1.5'
                    : 'min-h-24 min-w-0 items-center justify-center border-dashed p-1.5'
                }
              >
                {post ? (
                  <Draggable
                    id={post.id}
                    className="min-w-0 cursor-grab bg-transparent p-0 ring-0"
                    onClick={() => onSelect(post.id)}
                  >
                    <div
                      className="w-full min-w-0"
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

/** Dialog wrapper that mounts a fresh form body each time it opens. */
function NewPostDialog({
  open,
  onOpenChange,
  posts,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  posts: SocialPost[];
  onCreate: (post: SocialPost) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-slot="new-post-dialog">
        <DialogHeader>
          <DialogTitle>New post</DialogTitle>
          <DialogDescription>
            Schedule a post into an empty calendar slot.
          </DialogDescription>
        </DialogHeader>
        {/* Keyed on `open` so the form's state resets every time it reopens. */}
        <NewPostForm
          key={open ? 'open' : 'closed'}
          posts={posts}
          onCreate={onCreate}
          onOpenChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
}

/** Controlled form body; remounted on open so its fields start fresh. */
function NewPostForm({
  posts,
  onCreate,
  onOpenChange,
}: {
  posts: SocialPost[];
  onCreate: (post: SocialPost) => void;
  onOpenChange: (open: boolean) => void;
}) {
  const [platform, setPlatform] = React.useState<SocialPlatform>('instagram');
  const [caption, setCaption] = React.useState('');
  const [day, setDay] = React.useState<SocialDay>('mon');
  const [slot, setSlot] = React.useState<SocialSlot>('morning');
  const [error, setError] = React.useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = caption.trim();
    if (!trimmed) {
      setError('Add a caption for the post.');
      return;
    }
    // Respect the do-not-drop-onto-occupied-cell rule.
    const occupied = posts.some((p) => p.slot === slot && p.day === day);
    if (occupied) {
      setError('That slot is taken — pick an empty day and time.');
      return;
    }
    onCreate({
      id: `new-${Date.now()}`,
      platform,
      caption: trimmed,
      day,
      slot,
    });
    onOpenChange(false);
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit}
      data-slot="new-post-form"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="new-post-platform">Platform</Label>
        <select
          id="new-post-platform"
          className={selectClass}
          value={platform}
          onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
        >
          {PLATFORMS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="new-post-caption">Caption</Label>
        <Input
          id="new-post-caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="What's the post about?"
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="new-post-day">Day</Label>
          <select
            id="new-post-day"
            className={selectClass}
            value={day}
            onChange={(e) => setDay(e.target.value as SocialDay)}
          >
            {DAYS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="new-post-slot">Time</Label>
          <select
            id="new-post-slot"
            className={selectClass}
            value={slot}
            onChange={(e) => setSlot(e.target.value as SocialSlot)}
          >
            {SLOTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="text-xs text-destructive"
          data-slot="new-post-error"
        >
          {error}
        </p>
      )}

      <DialogFooter>
        <DialogClose asChild>
          <Btn type="button" variant="outline" size="sm">
            Cancel
          </Btn>
        </DialogClose>
        <Btn type="submit" size="sm">
          Add post
        </Btn>
      </DialogFooter>
    </form>
  );
}

function Studio({ data }: { data: SocialData }) {
  // Cell assignments seeded from the endpoint, then owned by local state.
  const [posts, setPosts] = React.useState<SocialPost[]>(data.posts);
  const [selectedId, setSelectedId] = React.useState<string | null>(
    data.posts[0]?.id ?? null,
  );
  const [resolution, setResolution] = React.useState<DraftResolution | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = React.useState(false);

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

  function handleCreate(post: SocialPost) {
    setPosts((prev) => {
      // Guard again at the source of truth: never overwrite an occupied cell.
      const occupied = prev.some(
        (p) => p.slot === post.slot && p.day === post.day,
      );
      if (occupied) return prev;
      return [...prev, post];
    });
    setSelectedId(post.id);
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
        <Btn size="sm" onClick={() => setDialogOpen(true)}>
          + New post
        </Btn>
      </div>

      <NewPostDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        posts={posts}
        onCreate={handleCreate}
      />

      <DragDropProvider onDragEnd={handleDragEnd}>
        <SortableContext
          items={posts.map((p) => p.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_14rem]">
            <Panel className="min-w-0 overflow-x-auto">
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
          </div>
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
            <div
              key={selectedId}
              className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-1 duration-300 motion-reduce:animate-none"
            >
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

              {resolution ? (
                <DraftStatus
                  resolution={resolution}
                  onUndo={() => setResolution(null)}
                />
              ) : (
                <ApprovalBar
                  value={data.variations[0]?.text ?? selected.caption}
                  onApprove={() => setResolution('approved')}
                  onReject={() => setResolution('rejected')}
                />
              )}
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
