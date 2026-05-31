import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { DraftStatus } from './draft-status';

const meta = {
  title: 'AI/DraftStatus',
  component: DraftStatus,
  tags: ['autodocs'],
  args: {
    resolution: 'approved',
    onUndo: fn(),
  },
  decorators: [
    (Story) => (
      <div className="max-w-xl rounded-xl border border-border bg-card p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DraftStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Approved: Story = {};

export const Rejected: Story = {
  args: { resolution: 'rejected' },
};

export const Undo: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /undo/i }));
    await expect(args.onUndo).toHaveBeenCalledTimes(1);
  },
};
