import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ConversionFunnel } from './conversion-funnel';

const meta = {
  title: 'Charts/ConversionFunnel',
  component: ConversionFunnel,
  tags: ['autodocs'],
} satisfies Meta<typeof ConversionFunnel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    stages: [
      { label: 'Visited', value: 100 },
      { label: 'Added to cart', value: 60 },
      { label: 'Checked out', value: 24 },
    ],
    className: 'w-96',
  },
};

export const BookingFlow: Story = {
  args: {
    stages: [
      { label: 'Site visits', value: 4820 },
      { label: 'Viewed menu', value: 2640 },
      { label: 'Started booking', value: 980 },
      { label: 'Confirmed reservation', value: 412 },
    ],
    className: 'w-96',
  },
};

export const Empty: Story = {
  args: {
    stages: [],
    className: 'w-96',
  },
};
