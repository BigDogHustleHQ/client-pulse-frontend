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

// Children-as-function lets the handle live anywhere inside the item.
export const CustomHandlePlacement: Story = {
  args: {
    children: ({ attributes, listeners }) => (
      <div className="flex w-full items-center justify-between">
        <span className="text-sm">Handle on the right</span>
        <button
          type="button"
          aria-label="Drag to reorder"
          className="cursor-grab text-xs text-muted-foreground"
          {...attributes}
          {...listeners}
        >
          ⋮⋮
        </button>
      </div>
    ),
  },
};

type Item = { id: string; label: string };

const initialItems: Item[] = [
  { id: 'covers', label: 'Covers today' },
  { id: 'reservations', label: 'Upcoming reservations' },
  { id: 'reviews', label: 'New reviews' },
  { id: 'orders', label: 'Online orders' },
];

function SortableListDemo() {
  const [items, setItems] = React.useState(initialItems);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((current) => {
        const oldIndex = current.findIndex((i) => i.id === active.id);
        const newIndex = current.findIndex((i) => i.id === over.id);
        return arrayMove(current, oldIndex, newIndex);
      });
    }
  }

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex w-80 flex-col gap-2">
          {items.map((item, index) => (
            <Draggable key={item.id} id={item.id}>
              <span className="text-sm">{item.label}</span>
              <Pill className="ml-auto">{index + 1}</Pill>
            </Draggable>
          ))}
        </div>
      </SortableContext>
    </DragDropProvider>
  );
}

// Full reorderable list with internal state. Keyboard: focus a handle, press
// space to lift, arrows to move, space to drop.
export const SortableList: Story = {
  render: () => <SortableListDemo />,
  decorators: [(Story) => <Story />],
};
