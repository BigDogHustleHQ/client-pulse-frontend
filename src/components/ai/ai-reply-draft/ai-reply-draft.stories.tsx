import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { AIReplyDraft } from './ai-reply-draft';
import { MockAIProvider } from '../mock-ai-provider/mock-ai-provider';

const REVIEW_REPLY = [
  'Hi Jordan, ',
  'thank ',
  'you ',
  'for ',
  'the ',
  'kind ',
  'words! ',
  "We're ",
  'thrilled ',
  'you ',
  'enjoyed ',
  'your ',
  'visit.',
];

const meta = {
  title: 'AI/AIReplyDraft',
  component: AIReplyDraft,
  tags: ['autodocs'],
  args: {
    prompt: 'Reply to this 5-star review',
    confidence: 0.92,
    onApprove: fn(),
    onEdit: fn(),
    onReject: fn(),
  },
  decorators: [
    (Story) => (
      <MockAIProvider tokens={REVIEW_REPLY} delay={0}>
        <div className="max-w-xl">
          <Story />
        </div>
      </MockAIProvider>
    ),
  ],
} satisfies Meta<typeof AIReplyDraft>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HighConfidence: Story = {};

export const LowConfidence: Story = {
  args: { confidence: 0.42 },
};

export const ApproveFlow: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText(/thrilled you enjoyed your visit/i);
    await userEvent.click(canvas.getByRole('button', { name: /approve/i }));
    await expect(args.onApprove).toHaveBeenCalled();
  },
};
