import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ApprovalBar } from './approval-bar';

const meta = {
  title: 'AI/ApprovalBar',
  component: ApprovalBar,
  tags: ['autodocs'],
  args: {
    value: "Thanks so much for your feedback — we'd love to make this right!",
    onApprove: fn(),
    onEdit: fn(),
    onReject: fn(),
  },
  decorators: [
    (Story) => (
      <div className="max-w-xl rounded-xl border border-border bg-card p-4">
        <p className="mb-3 text-sm text-foreground">
          Thanks so much for your feedback — we&apos;d love to make this right!
        </p>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ApprovalBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Approve: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /approve/i }));
    await expect(args.onApprove).toHaveBeenCalledWith(args.value);
  },
};

export const EditAndSave: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /edit/i }));
    const editor = canvas.getByLabelText('Edit draft');
    await userEvent.clear(editor);
    await userEvent.type(editor, 'Edited reply');
    await userEvent.click(canvas.getByRole('button', { name: /save/i }));
    await expect(args.onEdit).toHaveBeenCalledWith('Edited reply');
  },
};

export const Reject: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /reject/i }));
    await expect(args.onReject).toHaveBeenCalled();
  },
};
