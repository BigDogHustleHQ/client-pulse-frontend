import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { MiniTable, type MiniTableColumn } from './mini-table';

type Row = { name: string; covers: number };

const columns: MiniTableColumn<Row>[] = [
  { key: 'name', header: 'Service' },
  {
    key: 'covers',
    header: 'Covers',
    align: 'right',
    render: (r) => `${r.covers} seats`,
  },
];

const data: Row[] = [
  { name: 'Lunch', covers: 48 },
  { name: 'Dinner', covers: 94 },
];

describe('MiniTable', () => {
  it('renders headers and rows', () => {
    render(<MiniTable columns={columns} data={data} rowKey={(r) => r.name} />);
    expect(screen.getByText('Service')).toBeInTheDocument();
    expect(screen.getByText('Lunch')).toBeInTheDocument();
    expect(screen.getByText('94 seats')).toBeInTheDocument();
  });

  it('renders the empty state when there is no data', () => {
    render(
      <MiniTable
        columns={columns}
        data={[]}
        rowKey={(r) => r.name}
        empty="Nothing here"
      />,
    );
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <MiniTable columns={columns} data={data} rowKey={(r) => r.name} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
