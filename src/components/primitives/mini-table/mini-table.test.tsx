import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('does not make rows interactive without onRowClick', () => {
    render(<MiniTable columns={columns} data={data} rowKey={(r) => r.name} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onRowClick when a row is clicked', async () => {
    const user = userEvent.setup();
    const onRowClick = jest.fn();
    render(
      <MiniTable
        columns={columns}
        data={data}
        rowKey={(r) => r.name}
        onRowClick={onRowClick}
      />,
    );

    const rows = screen.getAllByRole('button');
    expect(rows).toHaveLength(2);
    await user.click(rows[1]);
    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(onRowClick).toHaveBeenCalledWith(data[1], 1);
  });

  it('activates a row via the keyboard and marks the selected row', async () => {
    const user = userEvent.setup();
    const onRowClick = jest.fn();
    render(
      <MiniTable
        columns={columns}
        data={data}
        rowKey={(r) => r.name}
        onRowClick={onRowClick}
        isRowSelected={(r) => r.name === 'Lunch'}
      />,
    );

    const [firstRow] = screen.getAllByRole('button');
    expect(firstRow).toHaveAttribute('aria-selected', 'true');

    firstRow.focus();
    await user.keyboard('{Enter}');
    expect(onRowClick).toHaveBeenCalledWith(data[0], 0);

    await user.keyboard(' ');
    expect(onRowClick).toHaveBeenCalledTimes(2);
  });
});
