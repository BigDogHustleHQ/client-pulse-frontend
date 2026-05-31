'use client';

import * as React from 'react';
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Sparkles, Star } from 'lucide-react';
import {
  AIReplyDraft,
  DraftStatus,
  MockAIProvider,
  type DraftResolution,
} from '@/components/ai';
import { DragDropProvider, Draggable, Dropzone } from '@/components/dnd';
import { Btn, Panel, PanelHead, Pill } from '@/components/primitives';
import { PageError, PageLoading } from '@/components/shell/page-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useVendors } from '@/hooks/use-vendors';
import type {
  Vendor,
  VendorLane,
  VendorLaneId,
  VendorStatus,
} from '@/types/vendors';

const STATUS_TONE: Record<VendorStatus, 'brand' | 'warning' | 'success'> = {
  new: 'brand',
  pending: 'warning',
  signed: 'success',
};

function Rating({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <Star
        className="size-3.5 fill-amber-400 text-amber-400"
        aria-hidden="true"
      />
      {value.toFixed(1)}
    </span>
  );
}

function VendorCard({
  vendor,
  onDraft,
}: {
  vendor: Vendor;
  onDraft: (vendor: Vendor) => void;
}) {
  return (
    <Draggable
      id={vendor.id}
      className="block items-stretch bg-transparent p-0 ring-0"
    >
      {({ attributes, listeners }) => (
        <Card size="sm" className="w-full">
          <CardHeader className="grid-cols-[auto_1fr_auto] items-center">
            <button
              type="button"
              aria-label={`Drag ${vendor.name}`}
              className="-ml-1 inline-flex size-6 cursor-grab touch-none items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground active:cursor-grabbing"
              {...attributes}
              {...listeners}
            >
              <span
                aria-hidden="true"
                className="text-base leading-none tracking-tighter"
              >
                ⋮⋮
              </span>
            </button>
            <CardTitle className="truncate">{vendor.name}</CardTitle>
            <Pill tone={STATUS_TONE[vendor.status]}>{vendor.status}</Pill>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 pl-9">
            <div className="flex items-center gap-3">
              {vendor.rating != null && <Rating value={vendor.rating} />}
              {vendor.price && (
                <span className="text-xs font-medium text-foreground">
                  {vendor.price}
                </span>
              )}
            </div>
            {vendor.poc && (
              <p className="text-xs text-muted-foreground">POC: {vendor.poc}</p>
            )}
            <Btn
              variant="secondary"
              size="sm"
              className="w-fit"
              onClick={() => onDraft(vendor)}
            >
              <Sparkles className="size-3.5 text-brand" />
              {vendor.lane === 'leads' ? 'Draft email' : 'Call tips'}
            </Btn>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
}

/** A lightweight card snapshot used in the DragOverlay so the floating
 *  preview matches the actual card without inheriting sortable transforms. */
function VendorCardOverlay({ vendor }: { vendor: Vendor }) {
  return (
    <Card size="sm" className="w-full rotate-2 shadow-xl ring-1 ring-brand/30">
      <CardHeader className="grid-cols-[auto_1fr_auto] items-center">
        <span
          aria-hidden="true"
          className="-ml-1 inline-flex size-6 cursor-grabbing items-center justify-center rounded-md text-muted-foreground text-base leading-none tracking-tighter"
        >
          ⋮⋮
        </span>
        <CardTitle className="truncate">{vendor.name}</CardTitle>
        <Pill tone={STATUS_TONE[vendor.status]}>{vendor.status}</Pill>
      </CardHeader>
      {(vendor.rating != null || vendor.price || vendor.poc) && (
        <CardContent className="flex flex-col gap-2 pl-9">
          <div className="flex items-center gap-3">
            {vendor.rating != null && <Rating value={vendor.rating} />}
            {vendor.price && (
              <span className="text-xs font-medium text-foreground">
                {vendor.price}
              </span>
            )}
          </div>
          {vendor.poc && (
            <p className="text-xs text-muted-foreground">POC: {vendor.poc}</p>
          )}
        </CardContent>
      )}
    </Card>
  );
}

const LANE_IDS: VendorLaneId[] = ['leads', 'contacted', 'quoted', 'signed'];
const isLaneId = (id: string): id is VendorLaneId =>
  (LANE_IDS as string[]).includes(id);

function KanbanBoard({
  lanes,
  vendors,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDraft,
  activeDragId,
}: {
  lanes: VendorLane[];
  vendors: Vendor[];
  onDragStart: (event: DragStartEvent) => void;
  onDragOver: (event: DragOverEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onDraft: (vendor: Vendor) => void;
  activeDragId: string | null;
}) {
  const byLane = (laneId: VendorLaneId) =>
    vendors.filter((v) => v.lane === laneId);

  const activeVendor = activeDragId
    ? vendors.find((v) => v.id === activeDragId)
    : null;

  // Custom sensors: PointerSensor with an activation distance so clicks on
  // buttons inside the card (e.g. "Draft email") do not start a drag.
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <DragDropProvider
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {lanes.map((lane) => {
          const laneVendors = byLane(lane.id);
          return (
            <Dropzone
              key={lane.id}
              id={lane.id}
              className="min-h-40 gap-3 bg-secondary/30"
            >
              <div className="flex items-center justify-between px-1">
                <span className="text-sm font-medium">{lane.label}</span>
                <span className="text-xs text-muted-foreground">
                  {laneVendors.length}
                </span>
              </div>
              <SortableContext
                items={laneVendors.map((v) => v.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-3">
                  {laneVendors.map((vendor) => (
                    <VendorCard
                      key={vendor.id}
                      vendor={vendor}
                      onDraft={onDraft}
                    />
                  ))}
                </div>
              </SortableContext>
            </Dropzone>
          );
        })}
      </div>

      {/* Floating card preview that follows the cursor while dragging.
          Uses a subtle rotate + shadow to signal it is "lifted". */}
      <DragOverlay
        dropAnimation={{
          duration: 200,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
          sideEffects: undefined,
        }}
        className="motion-reduce:!transition-none"
      >
        {activeVendor ? <VendorCardOverlay vendor={activeVendor} /> : null}
      </DragOverlay>
    </DragDropProvider>
  );
}

function AddVendorDialog({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (vendor: { name: string; poc: string; price: string }) => void;
}) {
  const [name, setName] = React.useState('');
  const [poc, setPoc] = React.useState('');
  const [price, setPrice] = React.useState('');

  // Reset the form whenever the dialog opens so a prior draft never lingers.
  const [prevOpen, setPrevOpen] = React.useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setName('');
      setPoc('');
      setPrice('');
    }
  }

  const trimmedName = name.trim();
  const canSubmit = trimmedName.length > 0;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    onAdd({
      name: trimmedName,
      poc: poc.trim(),
      price: price.trim(),
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add vendor</DialogTitle>
          <DialogDescription>
            New vendors join the Leads lane so you can start outreach.
          </DialogDescription>
        </DialogHeader>
        <form
          id="add-vendor-form"
          className="flex flex-col gap-3"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="vendor-name">Vendor name</Label>
            <Input
              id="vendor-name"
              name="name"
              value={name}
              autoFocus
              autoComplete="off"
              placeholder="e.g. Meadow Dairy"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="vendor-poc">Point of contact</Label>
            <Input
              id="vendor-poc"
              name="poc"
              value={poc}
              autoComplete="off"
              placeholder="Optional, e.g. Jordan Lee"
              onChange={(e) => setPoc(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="vendor-price">Price</Label>
            <Input
              id="vendor-price"
              name="price"
              value={price}
              autoComplete="off"
              placeholder="Optional, e.g. $5.10/lb"
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Btn variant="outline" size="sm">
              Cancel
            </Btn>
          </DialogClose>
          <Btn
            type="submit"
            form="add-vendor-form"
            size="sm"
            disabled={!canSubmit}
          >
            Add vendor
          </Btn>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function VendorsPage() {
  const { data, isLoading, isError } = useVendors();
  const [vendors, setVendors] = React.useState<Vendor[]>([]);
  // Track the id of the card currently being dragged so we can render the
  // DragOverlay preview and dim the ghost in place.
  const [draggingId, setDraggingId] = React.useState<string | null>(null);
  const [activeVendorId, setActiveVendorId] = React.useState<string | null>(
    null,
  );
  const [resolution, setResolution] = React.useState<DraftResolution | null>(
    null,
  );
  const [prevDraftText, setPrevDraftText] = React.useState<string | null>(null);
  const [addOpen, setAddOpen] = React.useState(false);

  // Seed local board state from the endpoint without an effect: when a fresh
  // payload arrives, sync during render (the pattern ApprovalBar uses).
  const seed = data?.data.vendors;
  const [prevSeed, setPrevSeed] = React.useState(seed);
  if (seed && seed !== prevSeed) {
    setPrevSeed(seed);
    setVendors(seed);
  }

  if (isLoading) return <PageLoading label="Loading vendors…" />;
  if (isError || !data) return <PageError message="Couldn't load Vendors." />;

  const { category, lanes, coldEmail } = data.data;
  const activeVendor = vendors.find((v) => v.id === activeVendorId);
  const draftPrompt = activeVendor
    ? `Draft a warm, concise cold email to ${activeVendor.name}.`
    : coldEmail.prompt;
  const draftText = activeVendor
    ? `Hi ${activeVendor.poc ?? 'there'}, we run a 90-seat bistro and would love a wholesale quote from ${activeVendor.name}. Could we set up a quick call this week? Thanks — Maria`
    : coldEmail.draft;

  // When the user picks a different vendor the draft changes, so reset the
  // resolution during render (same prev-value sync pattern as the board seed)
  // to make the fresh draft approvable again.
  if (draftText !== prevDraftText) {
    setPrevDraftText(draftText);
    setResolution(null);
  }

  // Capture the dragging id so the DragOverlay can render the right card.
  function handleDragStart(event: DragStartEvent) {
    setDraggingId(String(event.active.id));
  }

  // Live optimistic lane re-tag as the card moves over a new lane or card.
  // This makes cards appear to "move in" before the user releases.
  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    setVendors((prev) => {
      const moving = prev.find((v) => v.id === activeId);
      if (!moving) return prev;

      const targetLane: VendorLaneId = isLaneId(overId)
        ? overId
        : (prev.find((v) => v.id === overId)?.lane ?? moving.lane);

      // Only re-tag if the lane actually changes to avoid thrashing.
      if (moving.lane === targetLane) return prev;

      return prev.map((v) =>
        v.id === activeId ? { ...v, lane: targetLane } : v,
      );
    });
  }

  // On drop: finalise position within the target lane (reorder relative to
  // the card it was dropped on top of, if any).
  function handleDragEnd(event: DragEndEvent) {
    setDraggingId(null);
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    setVendors((prev) => {
      const moving = prev.find((v) => v.id === activeId);
      if (!moving) return prev;

      // Re-tag lane (handles drop onto empty lane dropzone).
      const targetLane: VendorLaneId = isLaneId(overId)
        ? overId
        : (prev.find((v) => v.id === overId)?.lane ?? moving.lane);

      const next = prev.map((v) =>
        v.id === activeId ? { ...v, lane: targetLane } : v,
      );

      // Reorder within the lane when dropped on top of another card.
      if (!isLaneId(overId)) {
        const from = next.findIndex((v) => v.id === activeId);
        const to = next.findIndex((v) => v.id === overId);
        if (from !== -1 && to !== -1) return arrayMove(next, from, to);
      }
      return next;
    });
  }

  function handleAddVendor(input: {
    name: string;
    poc: string;
    price: string;
  }) {
    const newVendor: Vendor = {
      id: `local-${Date.now()}`,
      lane: 'leads',
      name: input.name,
      status: 'new',
      ...(input.poc ? { poc: input.poc } : {}),
      ...(input.price ? { price: input.price } : {}),
    };
    setVendors((prev) => [...prev, newVendor]);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Vendors
          </h2>
          <p className="text-sm text-muted-foreground">
            Category: <span className="text-foreground">{category}</span> · drag
            cards across lanes
          </p>
        </div>
        <Btn size="sm" onClick={() => setAddOpen(true)}>
          + Add vendor
        </Btn>
      </div>

      <AddVendorDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onAdd={handleAddVendor}
      />

      <KanbanBoard
        lanes={lanes}
        vendors={vendors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDraft={(v) => setActiveVendorId(v.id)}
        activeDragId={draggingId}
      />

      <Panel>
        <PanelHead
          title="Cold-email draft"
          description={
            activeVendor
              ? `Outreach for ${activeVendor.name}`
              : 'Pick a vendor card to tailor the outreach'
          }
          actions={<Pill tone="brand">AI</Pill>}
        />
        <div
          key={draftText}
          className="animate-in fade-in duration-300 motion-reduce:animate-none"
        >
          {resolution ? (
            <DraftStatus
              resolution={resolution}
              onUndo={() => setResolution(null)}
            />
          ) : (
            <MockAIProvider key={draftText} tokens={[draftText]} delay={0}>
              <AIReplyDraft
                title={
                  activeVendor
                    ? `Cold email — ${activeVendor.name}`
                    : coldEmail.title
                }
                prompt={draftPrompt}
                confidence={coldEmail.confidence}
                onApprove={() => setResolution('approved')}
                onReject={() => setResolution('rejected')}
              />
            </MockAIProvider>
          )}
        </div>
      </Panel>
    </div>
  );
}
