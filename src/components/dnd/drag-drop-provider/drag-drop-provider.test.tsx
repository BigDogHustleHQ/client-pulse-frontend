import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { DragDropProvider } from './drag-drop-provider';

describe('DragDropProvider', () => {
  it('renders its children', () => {
    render(
      <DragDropProvider>
        <div>board content</div>
      </DragDropProvider>,
    );
    expect(screen.getByText('board content')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <DragDropProvider>
        <div>board content</div>
      </DragDropProvider>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
