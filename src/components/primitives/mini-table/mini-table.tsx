import * as React from 'react';
import { cn } from '@/lib/utils';

type Column<T> = {
  key: string;
  header: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  render?: (row: T) => React.ReactNode;
};

function MiniTable<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  empty = 'No data',
  className,
  ...props
}: Omit<React.ComponentProps<'table'>, 'children'> & {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T, index: number) => string;
  empty?: React.ReactNode;
}) {
  const alignClass = (a?: Column<T>['align']) =>
    a === 'right' ? 'text-right' : a === 'center' ? 'text-center' : 'text-left';

  return (
    <table
      data-slot="mini-table"
      className={cn('w-full text-sm', className)}
      {...props}
    >
      <thead>
        <tr className="border-b border-border">
          {columns.map((c) => (
            <th
              key={c.key}
              className={cn(
                'px-2 py-1.5 text-xs font-medium text-muted-foreground',
                alignClass(c.align),
              )}
            >
              {c.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length}
              className="px-2 py-6 text-center text-muted-foreground"
            >
              {empty}
            </td>
          </tr>
        ) : (
          data.map((row, i) => (
            <tr
              key={rowKey(row, i)}
              className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/40 motion-reduce:transition-none"
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={cn('px-2 py-2 tabular-nums', alignClass(c.align))}
                >
                  {c.render ? c.render(row) : String(row[c.key] ?? '')}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export { MiniTable };
export type { Column as MiniTableColumn };
