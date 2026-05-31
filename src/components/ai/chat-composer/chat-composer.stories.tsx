import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ChatComposer } from './chat-composer';
import { MockAIProvider } from '../mock-ai-provider/mock-ai-provider';

const meta = {
  title: 'AI/ChatComposer',
  component: ChatComposer,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MockAIProvider>
        <div className="max-w-xl">
          <Story />
        </div>
      </MockAIProvider>
    ),
  ],
} satisfies Meta<typeof ChatComposer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Streaming: Story = {
  decorators: [
    (Story) => (
      <MockAIProvider
        tokens={['Sure', ', ', 'here ', 'is ', 'your ', 'reply', '.']}
        delay={30}
      >
        <div className="max-w-xl">
          <Story />
        </div>
      </MockAIProvider>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      canvas.getByLabelText('Prompt'),
      'Draft a thank-you note',
    );
    await userEvent.click(canvas.getByRole('button', { name: /send/i }));
    await expect(
      await canvas.findByText('Sure, here is your reply.'),
    ).toBeInTheDocument();
  },
};
