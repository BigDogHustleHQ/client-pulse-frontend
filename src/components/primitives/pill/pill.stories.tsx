import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Pill } from './pill';

const meta = {
  title: 'Primitives/Pill',
  component: Pill,
  tags: ['autodocs'],
  args: { children: 'Confirmed' },
  argTypes: {
    tone: {
      control: 'select',
      options: [
        'neutral',
        'brand',
        'primary',
        'success',
        'warning',
        'danger',
        'info',
      ],
    },
  },
} satisfies Meta<typeof Pill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllTones: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Pill tone="neutral">Draft</Pill>
      <Pill tone="brand">Featured</Pill>
      <Pill tone="primary">Active</Pill>
      <Pill tone="success">Confirmed</Pill>
      <Pill tone="warning">Pending</Pill>
      <Pill tone="danger">Cancelled</Pill>
      <Pill tone="info">Scheduled</Pill>
    </div>
  ),
};
