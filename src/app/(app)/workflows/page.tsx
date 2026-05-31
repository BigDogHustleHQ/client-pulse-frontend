'use client';

import * as React from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Clock,
  GitBranch,
  Plus,
  SendHorizontal,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import {
  ApprovalBar,
  ChatComposer,
  DraftStatus,
  MockAIProvider,
  type DraftResolution,
} from '@/components/ai';
import { DragDropProvider, Draggable, Dropzone } from '@/components/dnd';
import { Btn, Panel, PanelHead, Pill, Stack } from '@/components/primitives';
import { PageError, PageLoading } from '@/components/shell/page-state';
import { useWorkflows } from '@/hooks/use-workflows';
import type {
  WorkflowEdge,
  WorkflowNode,
  WorkflowNodeKind,
  WorkflowPaletteNode,
} from '@/types/workflows';

// Map the endpoint's icon names to lucide glyphs (data never imports React).
const ICONS: Record<string, LucideIcon> = {
  Zap,
  Sparkles,
  GitBranch,
  ShieldCheck,
  SendHorizontal,
  Clock,
};

// The droppable canvas surface. Dropping a palette item here appends a node.
const CANVAS_DROPZONE_ID = 'canvas';

// Resolve a node kind from a palette item's id (e.g. `pal-trigger` → `trigger`).
const PALETTE_KIND: Record<string, WorkflowNodeKind> = {
  'pal-trigger': 'trigger',
  'pal-ai': 'ai',
  'pal-condition': 'condition',
  'pal-approval': 'approval',
  'pal-send': 'send',
  'pal-wait': 'wait',
};

// Monotonic counter so appended node/edge ids stay unique across the session.
let nodeSeq = 0;

/**
 * Build a fresh canvas node from a palette item. Approval nodes get a draft so
 * the ApprovalBar lifecycle works on newly-added gates too.
 */
function nodeFromPalette(item: WorkflowPaletteNode): WorkflowNode {
  nodeSeq += 1;
  const kind = PALETTE_KIND[item.id] ?? 'ai';
  return {
    id: `n-${item.id}-${nodeSeq}`,
    kind,
    title: item.label,
    detail: item.hint,
    tag: item.tag,
    tagTone: item.tagTone,
    ...(kind === 'approval'
      ? {
          approvalDraft:
            'Drafted reply pending your sign-off — review and approve to send.',
        }
      : {}),
  };
}

// ---------------------------------------------------------------------------
// Co-located builder canvas. Renders the static graph supplied by the endpoint:
// node cards laid out top-to-bottom with SVG connectors drawn between them.
// Full free-drag node editing is intentionally out of scope.
// ---------------------------------------------------------------------------

const NODE_W = 240;
const NODE_H = 92;
const COL_GAP = 56;
const ROW_GAP = 64;

/** Resolve a deterministic (col,row) grid slot per node so edges line up. */
function layout(nodes: WorkflowNode[]) {
  // Branch nodes (anything after a `condition`) fan out into two columns.
  const slots = new Map<string, { col: number; row: number }>();
  let row = 0;
  let pendingBranch = false;
  let branchCol = 0;
  for (const node of nodes) {
    if (pendingBranch) {
      slots.set(node.id, { col: branchCol, row });
      branchCol += 1;
      if (branchCol > 1) {
        branchCol = 0;
        pendingBranch = false;
        row += 1;
      }
      continue;
    }
    slots.set(node.id, { col: 0, row });
    if (node.kind === 'condition') {
      pendingBranch = true;
      row += 1;
    } else {
      row += 1;
    }
  }
  return slots;
}

function nodeCenter(slot: { col: number; row: number }) {
  const x = slot.col * (NODE_W + COL_GAP) + NODE_W / 2;
  const y = slot.row * (NODE_H + ROW_GAP) + NODE_H / 2;
  return { x, y };
}

function CanvasNode({
  node,
  onRemove,
}: {
  node: WorkflowNode;
  onRemove?: (id: string) => void;
}) {
  const isApproval = node.kind === 'approval';
  const [resolution, setResolution] = React.useState<DraftResolution | null>(
    null,
  );

  return (
    <div
      data-slot="workflow-node"
      style={{ width: NODE_W }}
      className="group flex flex-col gap-2 rounded-xl bg-card p-3 text-card-foreground ring-1 ring-foreground/10 animate-in fade-in-0 duration-300 motion-reduce:animate-none"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium leading-snug">{node.title}</span>
          <span className="text-xs text-muted-foreground">{node.detail}</span>
        </div>
        <div className="flex items-center gap-1">
          {node.tag && <Pill tone={node.tagTone}>{node.tag}</Pill>}
          {onRemove && (
            <button
              type="button"
              aria-label={`Remove ${node.title}`}
              onClick={() => onRemove(node.id)}
              className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-secondary hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100 motion-reduce:transition-none"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
      {isApproval &&
        node.approvalDraft &&
        (resolution ? (
          <DraftStatus
            resolution={resolution}
            onUndo={() => setResolution(null)}
          />
        ) : (
          <ApprovalBar
            value={node.approvalDraft}
            onApprove={() => setResolution('approved')}
            onReject={() => setResolution('rejected')}
          />
        ))}
    </div>
  );
}

function WorkflowCanvas({
  nodes,
  edges,
  onRemove,
}: {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  onRemove?: (id: string) => void;
}) {
  const slots = React.useMemo(() => layout(nodes), [nodes]);

  const cols = Math.max(1, ...[...slots.values()].map((s) => s.col + 1));
  const rows = Math.max(1, ...[...slots.values()].map((s) => s.row + 1));
  const width = cols * NODE_W + (cols - 1) * COL_GAP;
  const height = rows * NODE_H + (rows - 1) * ROW_GAP;

  return (
    <Dropzone
      id={CANVAS_DROPZONE_ID}
      className="relative mx-auto border-transparent p-0"
      style={{ width, height }}
    >
      <svg
        className="pointer-events-none absolute inset-0 text-border"
        width={width}
        height={height}
        aria-hidden="true"
      >
        {edges.map((edge) => {
          const a = slots.get(edge.from);
          const b = slots.get(edge.to);
          if (!a || !b) return null;
          const start = nodeCenter(a);
          const end = nodeCenter(b);
          const y1 = start.y + NODE_H / 2;
          const y2 = end.y - NODE_H / 2;
          const midY = (y1 + y2) / 2;
          const path = `M ${start.x} ${y1} C ${start.x} ${midY}, ${end.x} ${midY}, ${end.x} ${y2}`;
          return (
            <g key={edge.id}>
              <path
                d={path}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              />
              <circle cx={end.x} cy={y2} r={3} fill="currentColor" />
              {edge.label && (
                <text
                  x={(start.x + end.x) / 2}
                  y={midY - 4}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[10px]"
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {nodes.map((node) => {
        const slot = slots.get(node.id);
        if (!slot) return null;
        const left = slot.col * (NODE_W + COL_GAP);
        const top = slot.row * (NODE_H + ROW_GAP);
        return (
          <div key={node.id} className="absolute" style={{ left, top }}>
            <CanvasNode node={node} onRemove={onRemove} />
          </div>
        );
      })}
    </Dropzone>
  );
}

function PaletteItem({
  node,
  onAdd,
}: {
  node: WorkflowPaletteNode;
  onAdd: (node: WorkflowPaletteNode) => void;
}) {
  const Icon = ICONS[node.icon] ?? Sparkles;
  return (
    <Draggable id={node.id}>
      {({ attributes, listeners }) => (
        <>
          <button
            type="button"
            aria-label={`Drag ${node.label}`}
            className="inline-flex size-7 shrink-0 cursor-grab touch-none items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <Icon className="size-4" aria-hidden="true" />
          </button>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="truncate text-sm font-medium">{node.label}</span>
            <span className="truncate text-xs text-muted-foreground">
              {node.hint}
            </span>
          </div>
          <Pill tone={node.tagTone}>{node.tag}</Pill>
          <button
            type="button"
            aria-label={`Add ${node.label}`}
            onClick={() => onAdd(node)}
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground motion-reduce:transition-none"
          >
            <Plus className="size-4" aria-hidden="true" />
          </button>
        </>
      )}
    </Draggable>
  );
}

export default function WorkflowsPage() {
  const { data, isLoading, isError } = useWorkflows();

  // Lift the canvas graph into local state so palette adds/removes mutate it.
  const [nodes, setNodes] = React.useState<WorkflowNode[]>([]);
  const [edges, setEdges] = React.useState<WorkflowEdge[]>([]);

  // Seed local state from the endpoint without an effect: when a fresh payload
  // arrives, sync during render (the render-time pattern used in vendors/page).
  const seed = data?.data;
  const [prevSeed, setPrevSeed] = React.useState(seed);
  if (seed && seed !== prevSeed) {
    setPrevSeed(seed);
    setNodes(seed.nodes);
    setEdges(seed.edges);
  }

  // Append a node from a palette item and connect it from the current last node.
  const appendNode = React.useCallback((item: WorkflowPaletteNode) => {
    const next = nodeFromPalette(item);
    setNodes((prev) => {
      const last = prev[prev.length - 1];
      if (last) {
        setEdges((prevEdges) => [
          ...prevEdges,
          { id: `e-${last.id}-${next.id}`, from: last.id, to: next.id },
        ]);
      }
      return [...prev, next];
    });
  }, []);

  // Remove a canvas node and any edges touching it.
  const handleRemove = React.useCallback((id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.from !== id && e.to !== id));
  }, []);

  // Dropping a palette item onto the "canvas" dropzone appends its node too.
  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || over.id !== CANVAS_DROPZONE_ID) return;
      const item = data?.data.palette.find((p) => p.id === String(active.id));
      if (item) appendNode(item);
    },
    [appendNode, data],
  );

  if (isLoading) return <PageLoading label="Loading workflows…" />;
  if (isError || !data) return <PageError message="Couldn't load Workflows." />;

  const wf = data.data;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            {wf.name}
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Describe a workflow and the AI wires up the graph. Drag nodes from
            the palette, then activate.
          </p>
        </div>
        <Btn variant={wf.active ? 'secondary' : 'default'}>
          {wf.active ? 'Active' : 'Activate'}
        </Btn>
      </div>

      <Panel>
        <PanelHead
          title="Describe a workflow"
          description="The AI generates the graph from your prompt"
        />
        <MockAIProvider tokens={wf.aiTokens} delay={24}>
          <ChatComposer
            defaultValue={wf.prompt}
            placeholder="e.g. When a 4★+ review comes in, draft a thank-you…"
          />
        </MockAIProvider>
      </Panel>

      <DragDropProvider onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-[18rem_1fr] gap-6 max-lg:grid-cols-1">
          <Panel className="h-fit">
            <PanelHead
              title="Node palette"
              description="Drag a node onto the canvas, or tap + to add it"
            />
            <SortableContext
              items={wf.palette.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <Stack gap="sm">
                {wf.palette.map((node) => (
                  <PaletteItem key={node.id} node={node} onAdd={appendNode} />
                ))}
              </Stack>
            </SortableContext>
          </Panel>

          <Panel className="overflow-x-auto">
            <PanelHead
              title="Builder canvas"
              description="Nodes flow top-to-bottom · drag to connect"
            />
            <div className="py-4">
              <WorkflowCanvas
                nodes={nodes}
                edges={edges}
                onRemove={handleRemove}
              />
            </div>
          </Panel>
        </div>
      </DragDropProvider>
    </div>
  );
}
