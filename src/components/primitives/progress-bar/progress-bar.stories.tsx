import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProgressBar } from './progress-bar';

const meta = {
  title: 'Primitives/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  args: { value: 64, label: 'Monthly AI budget', showValue: true },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (a) => (
    <div className="w-72">
      <ProgressBar {...a} />
    </div>
  ),
};
export const Tones: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-3">
      <ProgressBar value={30} tone="primary" label="Primary" showValue />
      <ProgressBar value={55} tone="brand" label="Brand" showValue />
      <ProgressBar value={80} tone="success" label="Success" showValue />
      <ProgressBar value={70} tone="warning" label="Warning" showValue />
      <ProgressBar value={95} tone="danger" label="Danger" showValue />
    </div>
  ),
};
export const Empty: Story = {
  render: () => (
    <div className="w-72">
      <ProgressBar value={0} label="Not started" showValue />
    </div>
  ),
};
