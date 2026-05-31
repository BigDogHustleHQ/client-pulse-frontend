import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { DragEndEvent } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { Panel, PanelHead } from '@/components/primitives';
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

// A plain free-positioned draggable card (not sortable) for board columns.
function Card({ id, label }: { id: string; label: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });
  const style: React.CSSProperties = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : {};
  return (
    <div
      ref={setNodeRef}
      style={style}
      data-dragging={isDragging || undefined}
      className="flex items-center gap-2 rounded-lg bg-secondary p-2 text-secondary-foreground"
    >
      <DragHandle attributes={attributes} listeners={listeners} />
      <span className="text-sm">{label}</span>
    </div>
  );
}

const columns = ['todo', 'doing', 'done'] as const;
type Column = (typeof columns)[number];
const columnTitles: Record<Column, string> = {
  todo: 'To do',
  doing: 'In progress',
  done: 'Done',
};

function BoardDemo() {
  const [placement, setPlacement] = React.useState<Record<string, Column>>({
    'prep-stations': 'todo',
    'update-menu': 'todo',
    'staff-roster': 'doing',
    'order-supplies': 'done',
  });

  const labels: Record<string, string> = {
    'prep-stations': 'Prep stations',
    'update-menu': 'Update menu',
    'staff-roster': 'Staff roster',
    'order-supplies': 'Order supplies',
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && columns.includes(over.id as Column)) {
      setPlacement((current) => ({
        ...current,
        [String(active.id)]: over.id as Column,
      }));
    }
  }

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div className="flex gap-3">
        {columns.map((col) => (
          <Panel key={col} className="w-56">
            <PanelHead title={columnTitles[col]} />
            <Dropzone id={col} className="min-h-32">
              {Object.entries(placement)
                .filter(([, c]) => c === col)
                .map(([id]) => (
                  <Card key={id} id={id} label={labels[id]} />
                ))}
            </Dropzone>
          </Panel>
        ))}
      </div>
    </DragDropProvider>
  );
}

// Free board: cards move across droppable columns. Drag a card over a column to
// see the dashed highlight hint.
export const Board: Story = {
  render: () => <BoardDemo />,
  decorators: [(Story) => <Story />],
};
