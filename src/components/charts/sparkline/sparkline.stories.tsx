import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Sparkline } from './sparkline';

const meta = {
  title: 'Charts/Sparkline',
  component: Sparkline,
  tags: ['autodocs'],
} satisfies Meta<typeof Sparkline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: [4, 6, 5, 8, 7, 11, 9, 14, 12, 18],
  },
};

export const LineOnly: Story = {
  args: {
    data: [12, 9, 11, 7, 8, 5, 6, 4],
    fill: false,
    color: 'var(--primary)',
  },
};

export const Points: Story = {
  args: {
    data: [
      { x: 0, y: 10 },
      { x: 1, y: 14 },
      { x: 2, y: 8 },
      { x: 3, y: 16 },
      { x: 4, y: 12 },
    ],
    width: 160,
    height: 40,
  },
};

export const Empty: Story = {
  args: {
    data: [],
  },
};
