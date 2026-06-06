import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { DragEndEvent } from '@dnd-kit/core';
import { Pill } from '@/components/primitives';
import { DragHandle } from '../drag-handle/drag-handle';
import { DragDropProvider } from '../drag-drop-provider/drag-drop-provider';
import { Draggable } from './draggable';

const meta = {
  title: 'DnD/Draggable',
  component: Draggable,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <DragDropProvider onDragEnd={fn()}>
        <SortableContext
          items={['demo']}
          strategy={verticalListSortingStrategy}
        >
          <div className="w-80">
            <Story />
          </div>
        </SortableContext>
      </DragDropProvider>
    ),
  ],
  args: {
    id: 'demo',
    children: <span className="text-sm">Drag me</span>,
  },
} satisfies Meta<typeof Draggable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Children-as-function API: pass a render-prop to place the DragHandle anywhere
// in the card. `attributes` and `listeners` from useSortable are forwarded so
// you can spread them onto any element that should initiate dragging.
// Here the handle is pinned to the trailing edge while body content fills the
// left side — a common card layout pattern.
export const CustomHandlePlacement: Story = {
  args: {
    children: ({ attributes, listeners }) => (
      <div className="flex w-full items-center gap-3">
        {/* Body content — not wired to drag; only the handle initiates it */}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-sm font-medium text-foreground">
            Upcoming reservations
          </span>
          <span className="text-xs text-muted-foreground">
            12 bookings today
          </span>
        </div>
        {/* DragHandle on the trailing edge, receiving dnd-kit wiring */}
        <DragHandle
          aria-label="Drag to reorder Upcoming reservations"
          attributes={attributes}
          listeners={listeners}
        />
      </div>
    ),
  },
};

type Item = {
  id: string;
  label: string;
  count: number;
  tone?: 'success' | 'warning' | 'danger' | 'neutral';
};

const initialItems: Item[] = [
  { id: 'covers', label: 'Covers today', count: 42, tone: 'success' },
  {
    id: 'reservations',
    label: 'Upcoming reservations',
    count: 12,
    tone: 'neutral',
  },
  { id: 'reviews', label: 'New reviews', count: 7, tone: 'warning' },
  { id: 'orders', label: 'Online orders', count: 3, tone: 'danger' },
];

// Full reorderable list with arrayMove state management.
// Drag a row to reorder — the list order updates immediately on drop.
// Keyboard: focus a handle, press Space to lift, Arrow keys to move, Space to drop.
// The dragging item becomes semi-transparent (opacity-60) via data-dragging.
const SortableListDemo = () => {
  const [items, setItems] = React.useState(initialItems);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((current) => {
        const oldIndex = current.findIndex((i) => i.id === active.id);
        const newIndex = current.findIndex((i) => i.id === over.id);
        return arrayMove(current, oldIndex, newIndex);
      });
    }
  };

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex w-80 flex-col gap-2">
          {items.map((item) => (
            <Draggable key={item.id} id={item.id}>
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <span className="truncate text-sm font-medium text-foreground">
                  {item.label}
                </span>
              </div>
              <Pill tone={item.tone} className="ml-auto shrink-0 tabular-nums">
                {item.count}
              </Pill>
            </Draggable>
          ))}
        </div>
      </SortableContext>
    </DragDropProvider>
  );
};

// Full reorderable list with internal state. Keyboard: focus a handle, press
// Space to lift, Arrow keys to move, Space to drop.
export const SortableList: Story = {
  render: () => <SortableListDemo />,
  decorators: [(Story) => <Story />],
};
