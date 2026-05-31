import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DragDropProvider } from './drag-drop-provider/drag-drop-provider';
import { Draggable } from './draggable/draggable';

// Mirrors the SortableList story: a vertical SortableContext of Draggable
// items. jsdom cannot run pointer-based drag, so this verifies structure and
// rendered order rather than a live reorder (covered by Storybook/Playwright).
function SortableList({ items }: { items: string[] }) {
  return (
    <DragDropProvider>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item}>
              <Draggable id={item}>
                <span>{item}</span>
              </Draggable>
            </li>
          ))}
        </ul>
      </SortableContext>
    </DragDropProvider>
  );
}

describe('SortableList', () => {
  const items = ['Covers', 'Reservations', 'Reviews', 'Orders'];

  it('renders every item in order, each with a drag handle', () => {
    render(<SortableList items={items} />);

    const rendered = screen.getAllByRole('button', { name: 'Drag to reorder' });
    expect(rendered).toHaveLength(items.length);

    items.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });

    const listItems = screen.getAllByRole('listitem');
    expect(listItems.map((li) => li.textContent)).toEqual(items);
  });

  it('has no axe violations', async () => {
    const { container } = render(<SortableList items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
