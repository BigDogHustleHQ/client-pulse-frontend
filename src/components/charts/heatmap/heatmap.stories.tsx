import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Heatmap } from './heatmap';

const meta = {
  title: 'Charts/Heatmap',
  component: Heatmap,
  tags: ['autodocs'],
} satisfies Meta<typeof Heatmap>;

export default meta;
type Story = StoryObj<typeof meta>;

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = ['9a', '11a', '1p', '3p', '5p', '7p', '9p'];

export const Default: Story = {
  args: {
    rowLabels: days,
    colLabels: hours,
    legendLabel: 'Covers',
    data: [
      [2, 4, 12, 6, 8, 22, 14],
      [3, 5, 14, 7, 9, 24, 16],
      [3, 6, 15, 8, 10, 26, 18],
      [4, 7, 16, 9, 12, 30, 20],
      [6, 9, 18, 11, 16, 38, 28],
      [10, 14, 22, 18, 24, 44, 34],
      [8, 12, 20, 15, 20, 36, 26],
    ],
    className: 'w-[28rem]',
  },
};

export const WithMissingCells: Story = {
  args: {
    rowLabels: days.slice(0, 3),
    colLabels: hours.slice(0, 4),
    legendLabel: 'Covers',
    data: [
      [2, 4, null, 6],
      [3, null, 14, 7],
      [null, 6, 15, null],
    ],
    className: 'w-72',
  },
};

export const Empty: Story = {
  args: {
    data: [],
    className: 'w-72',
  },
};
