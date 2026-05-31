import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DragDropProvider } from './drag-drop-provider';
import { Draggable } from '../draggable/draggable';

const meta = {
  title: 'DnD/DragDropProvider',
  component: DragDropProvider,
  tags: ['autodocs'],
  args: {
    onDragStart: fn(),
    onDragEnd: fn(),
  },
} satisfies Meta<typeof DragDropProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = ['Reservations', 'Orders', 'Reviews'];

export const Default: Story = {
  render: (args) => (
    <DragDropProvider {...args}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="flex w-80 flex-col gap-2">
          {items.map((item) => (
            <Draggable key={item} id={item}>
              <span className="text-sm">{item}</span>
            </Draggable>
          ))}
        </div>
      </SortableContext>
    </DragDropProvider>
  ),
};
