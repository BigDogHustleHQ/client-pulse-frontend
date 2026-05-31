import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Pill } from '../pill/pill';
import { MiniTable, type MiniTableColumn } from './mini-table';

type Row = { name: string; covers: number; status: string };

const columns: MiniTableColumn<Row>[] = [
  { key: 'name', header: 'Service' },
  { key: 'covers', header: 'Covers', align: 'right' },
  {
    key: 'status',
    header: 'Status',
    align: 'right',
    render: (r) => (
      <Pill tone={r.status === 'Open' ? 'success' : 'neutral'}>{r.status}</Pill>
    ),
  },
];

const data: Row[] = [
  { name: 'Lunch', covers: 48, status: 'Closed' },
  { name: 'Dinner', covers: 94, status: 'Open' },
  { name: 'Late', covers: 12, status: 'Open' },
];

const meta = {
  title: 'Primitives/MiniTable',
  component: MiniTable,
  tags: ['autodocs'],
  args: { columns, data, rowKey: (r: Row) => r.name },
} satisfies Meta<typeof MiniTable<Row>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-80">
      <MiniTable columns={columns} data={data} rowKey={(r) => r.name} />
    </div>
  ),
};

export const EmptyState: Story = {
  render: () => (
    <div className="w-80">
      <MiniTable
        columns={columns}
        data={[]}
        rowKey={(r) => r.name}
        empty="No services today"
      />
    </div>
  ),
};
