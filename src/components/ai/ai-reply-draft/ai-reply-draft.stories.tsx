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
    onSubmit: fn(),
    onChange: fn(),
    onRegenerate: fn(),
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

export const Default: Story = {};

export const SubmitFlow: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByDisplayValue(/thrilled you enjoyed your visit/i);
    await userEvent.click(canvas.getByRole('button', { name: /submit/i }));
    await expect(args.onSubmit).toHaveBeenCalled();
  },
};

export const EditThenSubmit: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const box = await canvas.findByDisplayValue(
      /thrilled you enjoyed your visit/i,
    );
    await userEvent.clear(box);
    await userEvent.type(box, 'Thanks Jordan — see you next time!');
    await userEvent.click(canvas.getByRole('button', { name: /submit/i }));
    await expect(args.onSubmit).toHaveBeenCalledWith(
      'Thanks Jordan — see you next time!',
    );
  },
};

export const Regenerate: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByDisplayValue(/thrilled you enjoyed your visit/i);
    await userEvent.click(canvas.getByRole('button', { name: /regenerate/i }));
    await expect(args.onRegenerate).toHaveBeenCalled();
  },
};
