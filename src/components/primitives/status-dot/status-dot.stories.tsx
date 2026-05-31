import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { StatusDot } from './status-dot';

const meta = {
  title: 'Primitives/StatusDot',
  component: StatusDot,
  tags: ['autodocs'],
} satisfies Meta<typeof StatusDot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <StatusDot tone="online" label="Online" />
      <StatusDot tone="busy" label="Busy" />
      <StatusDot tone="offline" label="Offline" />
      <StatusDot tone="danger" label="Error" />
      <StatusDot tone="brand" label="Featured" />
    </div>
  ),
};

export const Pulsing: Story = {
  render: () => <StatusDot tone="online" pulse label="Live" />,
};
