import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CalendarCheck } from 'lucide-react';
import { KPI } from './kpi';

const meta = {
  title: 'Primitives/KPI',
  component: KPI,
  tags: ['autodocs'],
  args: { label: 'Covers today', value: '142' },
} satisfies Meta<typeof KPI>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (a) => (
    <div className="w-56">
      <KPI {...a} />
    </div>
  ),
};
export const PositiveDelta: Story = {
  render: (a) => (
    <div className="w-56">
      <KPI {...a} delta={12} deltaLabel="vs last week" />
    </div>
  ),
};
export const NegativeDelta: Story = {
  render: (a) => (
    <div className="w-56">
      <KPI {...a} value="89" delta={-8} deltaLabel="vs last week" />
    </div>
  ),
};
export const NegativeButGood: Story = {
  args: { label: 'No-show rate', value: '3%' },
  render: (a) => (
    <div className="w-56">
      <KPI {...a} delta={-2} positiveIsGood={false} />
    </div>
  ),
};
export const WithIcon: Story = {
  render: (a) => (
    <div className="w-56">
      <KPI {...a} icon={<CalendarCheck className="size-4" />} delta={5} />
    </div>
  ),
};
