import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MockAIProvider, useMockAI } from './mock-ai-provider';

const meta = {
  title: 'AI/MockAIProvider',
  component: MockAIProvider,
  tags: ['autodocs'],
  args: { children: null },
  parameters: {
    docs: {
      description: {
        component:
          'A deterministic stand-in for an AI backend. Wrap ChatComposer / AIReplyDraft in it for stories and tests. Configure `tokens` and `delay` to drive output.',
      },
    },
  },
} satisfies Meta<typeof MockAIProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

const Demo = () => {
  const { complete } = useMockAI();
  const [text, setText] = React.useState('');
  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        className="rounded-lg bg-primary px-3 py-1.5 text-sm text-primary-foreground"
        onClick={async () => setText(await complete('hi'))}
      >
        Run complete()
      </button>
      <p className="text-sm text-muted-foreground">
        {text || 'Result appears here.'}
      </p>
    </div>
  );
};

export const Usage: Story = {
  render: () => (
    <MockAIProvider
      tokens={['Hello ', 'from ', 'the ', 'mock ', 'AI.']}
      delay={0}
    >
      <Demo />
    </MockAIProvider>
  ),
};
