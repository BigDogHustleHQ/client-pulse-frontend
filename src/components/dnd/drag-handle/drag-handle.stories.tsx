import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DragHandle } from './drag-handle';

const meta = {
  title: 'DnD/DragHandle',
  component: DragHandle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Grip button that wires up dnd-kit drag behaviour when `attributes` and `listeners` are spread onto it. ' +
          'Pass `aria-label` to override the default "Drag to reorder" label for the context (e.g. `aria-label="Drag to reorder reservation"`).',
      },
    },
  },
} satisfies Meta<typeof DragHandle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InRow: Story = {
  render: () => (
    <div className="flex w-80 items-center gap-2 rounded-xl bg-card p-3 ring-1 ring-foreground/10">
      <DragHandle />
      <span className="text-sm">Drag this row</span>
    </div>
  ),
};
