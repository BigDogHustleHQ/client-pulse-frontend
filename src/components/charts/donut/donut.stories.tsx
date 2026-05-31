import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Donut } from './donut';

const meta = {
  title: 'Charts/Donut',
  component: Donut,
  tags: ['autodocs'],
} satisfies Meta<typeof Donut>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: [
      { label: 'Dine-in', value: 540 },
      { label: 'Takeout', value: 320 },
      { label: 'Delivery', value: 180 },
    ],
    totalLabel: 'Orders',
  },
};

export const CustomColors: Story = {
  args: {
    data: [
      { label: 'New', value: 60, color: 'var(--chart-1)' },
      { label: 'Returning', value: 140, color: 'var(--chart-3)' },
    ],
    totalLabel: 'Guests',
  },
};

export const Empty: Story = {
  args: {
    data: [
      { label: 'Dine-in', value: 0 },
      { label: 'Takeout', value: 0 },
    ],
    totalLabel: 'Orders',
  },
};
