import * as React from 'react';
import { cn } from '@/lib/utils';

type Column<T> = {
  key: string;
  header: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  render?: (row: T) => React.ReactNode;
};

const MiniTable = <T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  empty = 'No data',
  onRowClick,
  isRowSelected,
  className,
  ...props
}: Omit<React.ComponentProps<'table'>, 'children'> & {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T, index: number) => string;
  empty?: React.ReactNode;
  /**
   * Optional row-activation handler. When provided, each row becomes a
   * keyboard-accessible button (Enter/Space activate it). Omit it and rows
   * stay plain, fully backward-compatible <tr>s.
   */
  onRowClick?: (row: T, index: number) => void;
  /** Mark the active row (adds aria-selected + a selected style). */
  isRowSelected?: (row: T, index: number) => boolean;
}) => {
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
          data.map((row, i) => {
            const clickable = Boolean(onRowClick);
            const selected = isRowSelected?.(row, i) ?? false;
            return (
              <tr
                key={rowKey(row, i)}
                data-slot={clickable ? 'mini-table-row' : undefined}
                role={clickable ? 'button' : undefined}
                tabIndex={clickable ? 0 : undefined}
                aria-selected={clickable ? selected : undefined}
                onClick={clickable ? () => onRowClick?.(row, i) : undefined}
                onKeyDown={
                  clickable
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onRowClick?.(row, i);
                        }
                      }
                    : undefined
                }
                className={cn(
                  'border-b border-border/60 transition-colors last:border-0 hover:bg-muted/40 motion-reduce:transition-none',
                  clickable &&
                    'cursor-pointer outline-none focus-visible:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
                  selected && 'bg-muted/60',
                )}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={cn(
                      'px-2 py-2 tabular-nums',
                      alignClass(c.align),
                    )}
                  >
                    {c.render ? c.render(row) : String(row[c.key] ?? '')}
                  </td>
                ))}
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
};

export { MiniTable };
export type { Column as MiniTableColumn };
