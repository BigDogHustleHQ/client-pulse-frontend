import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { DragHandle } from './drag-handle';

describe('DragHandle', () => {
  it('exposes a button with the default aria-label', () => {
    render(<DragHandle />);
    const handle = screen.getByRole('button', { name: 'Drag to reorder' });
    expect(handle).toBeInTheDocument();
  });

  it('accepts a custom aria-label', () => {
    render(<DragHandle aria-label="Drag to reorder reservation" />);
    expect(
      screen.getByRole('button', { name: 'Drag to reorder reservation' }),
    ).toBeInTheDocument();
  });

  it('spreads dnd-kit listeners and attributes', () => {
    const onPointerDown = jest.fn();
    render(
      <DragHandle attributes={{ tabIndex: 0 }} listeners={{ onPointerDown }} />,
    );
    const handle = screen.getByRole('button', { name: 'Drag to reorder' });
    expect(handle).toHaveAttribute('tabindex', '0');
  });

  it('has no axe violations', async () => {
    const { container } = render(<DragHandle />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
