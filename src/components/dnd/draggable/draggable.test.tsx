import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DragDropProvider } from '../drag-drop-provider/drag-drop-provider';
import { Draggable } from './draggable';

function renderInContext(ui: React.ReactNode, ids: string[]) {
  return render(
    <DragDropProvider>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        {ui}
      </SortableContext>
    </DragDropProvider>,
  );
}

describe('Draggable', () => {
  it('renders its child content and a default handle', () => {
    renderInContext(
      <Draggable id="a">
        <span>Reservation row</span>
      </Draggable>,
      ['a'],
    );
    expect(screen.getByText('Reservation row')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Drag to reorder' }),
    ).toBeInTheDocument();
  });

  it('supports children-as-function for custom handle placement', () => {
    renderInContext(
      <Draggable id="a">
        {({ attributes, listeners }) => (
          <button
            type="button"
            aria-label="Drag to reorder"
            {...attributes}
            {...listeners}
          >
            custom
          </button>
        )}
      </Draggable>,
      ['a'],
    );
    expect(
      screen.getByRole('button', { name: 'Drag to reorder' }),
    ).toHaveTextContent('custom');
  });

  it('has no axe violations', async () => {
    const { container } = renderInContext(
      <Draggable id="a">
        <span>Reservation row</span>
      </Draggable>,
      ['a'],
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
