import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { DragEndEvent } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { Panel, PanelHead, Pill, Badge } from '@/components/primitives';
import { DragDropProvider } from '../drag-drop-provider/drag-drop-provider';
import { DragHandle } from '../drag-handle/drag-handle';
import { Dropzone } from './dropzone';

const meta = {
  title: 'DnD/Dropzone',
  component: Dropzone,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <DragDropProvider>
        <Story />
      </DragDropProvider>
    ),
  ],
  args: {
    id: 'demo-zone',
    children: (
      <span className="text-sm text-muted-foreground">Drop items here</span>
    ),
  },
} satisfies Meta<typeof Dropzone>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

type CardData = {
  id: string;
  label: string;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
};

const priorityTone: Record<
  CardData['priority'],
  'danger' | 'warning' | 'neutral'
> = {
  high: 'danger',
  medium: 'warning',
  low: 'neutral',
};

// A free-positioned draggable card (useDraggable, not sortable).
// The DragHandle receives dnd-kit's attributes/listeners; the rest of the card
// is plain content. While dragging, the card follows the pointer via translate3d
// and the data-dragging attribute triggers opacity-60 feedback in consuming CSS.
const Card = ({ card }: { card: CardData }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: card.id });
  const style: React.CSSProperties = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 10,
      }
    : {};
  return (
    <div
      ref={setNodeRef}
      style={style}
      data-dragging={isDragging || undefined}
      className="flex items-start gap-2 rounded-lg bg-card p-2.5 ring-1 ring-foreground/10 transition-[opacity,box-shadow] duration-200 data-[dragging]:opacity-60 data-[dragging]:shadow-lg"
    >
      <DragHandle
        attributes={attributes}
        listeners={listeners}
        aria-label={`Drag to reorder ${card.label}`}
        className="mt-0.5 shrink-0"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="truncate text-sm font-medium text-foreground">
          {card.label}
        </span>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">{card.assignee}</span>
          <Pill tone={priorityTone[card.priority]} className="text-[0.625rem]">
            {card.priority}
          </Pill>
        </div>
      </div>
    </div>
  );
};

const columns = ['todo', 'doing', 'done'] as const;
type Column = (typeof columns)[number];

const columnTitles: Record<Column, string> = {
  todo: 'To do',
  doing: 'In progress',
  done: 'Done',
};

const allCards: CardData[] = [
  {
    id: 'prep-stations',
    label: 'Prep station deep-clean',
    assignee: 'Maria R.',
    priority: 'high',
  },
  {
    id: 'update-menu',
    label: 'Update seasonal menu',
    assignee: 'Jake L.',
    priority: 'medium',
  },
  {
    id: 'staff-roster',
    label: 'Finalise staff roster',
    assignee: 'Priya K.',
    priority: 'high',
  },
  {
    id: 'order-supplies',
    label: 'Order weekly supplies',
    assignee: 'Tom S.',
    priority: 'low',
  },
  {
    id: 'review-feedback',
    label: 'Review guest feedback',
    assignee: 'Maria R.',
    priority: 'medium',
  },
];

const initialPlacement: Record<string, Column> = {
  'prep-stations': 'todo',
  'update-menu': 'todo',
  'staff-roster': 'doing',
  'order-supplies': 'done',
  'review-feedback': 'doing',
};

// Kanban board: drag any card over a column and release to move it there.
// The dashed highlight shows which column is the active drop target.
// onDragEnd fires when the pointer is released; we update placement only when
// the card was dropped over a valid column (not outside the board).
const BoardDemo = () => {
  const [placement, setPlacement] =
    React.useState<Record<string, Column>>(initialPlacement);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && columns.includes(over.id as Column)) {
      setPlacement((current) => ({
        ...current,
        [String(active.id)]: over.id as Column,
      }));
    }
  };

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div className="flex gap-3">
        {columns.map((col) => {
          const colCards = allCards.filter((c) => placement[c.id] === col);
          return (
            <Panel key={col} className="w-56">
              <PanelHead
                title={columnTitles[col]}
                actions={
                  <Badge tone={col === 'done' ? 'brand' : 'neutral'}>
                    {colCards.length}
                  </Badge>
                }
              />
              {/* Dropzone highlights with a dashed brand border when a card hovers over it */}
              <Dropzone id={col} className="min-h-32 flex-1">
                {colCards.map((card) => (
                  <Card key={card.id} card={card} />
                ))}
              </Dropzone>
            </Panel>
          );
        })}
      </div>
    </DragDropProvider>
  );
};

// Free board: cards move across droppable columns. Drag a card over a column to
// see the dashed highlight, then release to move it. The card count badge updates
// in each column header as cards move.
export const Board: Story = {
  render: () => <BoardDemo />,
  decorators: [(Story) => <Story />],
};
