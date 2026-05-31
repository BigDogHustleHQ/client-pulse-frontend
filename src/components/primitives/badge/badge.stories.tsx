import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Inbox } from 'lucide-react';
import { Badge } from './badge';

const meta = {
  title: 'Primitives/Badge',
  component: Badge,
  tags: ['autodocs'],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tones: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Badge count={3} />
      <Badge tone="brand" count={8} />
      <Badge tone="primary" count={12} />
      <Badge tone="danger" count={5} />
    </div>
  ),
};

export const Overflow: Story = {
  render: () => <Badge tone="danger" count={128} />,
};

export const OnIcon: Story = {
  render: () => (
    <div className="relative inline-flex">
      <Inbox className="size-6 text-muted-foreground" />
      <Badge
        tone="danger"
        size="sm"
        count={4}
        className="absolute -top-1.5 -right-2"
      />
    </div>
  ),
};
