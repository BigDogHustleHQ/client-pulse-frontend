import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { DragDropProvider } from '../drag-drop-provider/drag-drop-provider';
import { Dropzone } from './dropzone';

function renderInContext(ui: React.ReactNode) {
  return render(<DragDropProvider>{ui}</DragDropProvider>);
}

describe('Dropzone', () => {
  it('renders its children', () => {
    renderInContext(
      <Dropzone id="zone">
        <span>Drop here</span>
      </Dropzone>,
    );
    expect(screen.getByText('Drop here')).toBeInTheDocument();
  });

  it('exposes a dropzone slot that is not flagged over when idle', () => {
    const { container } = renderInContext(
      <Dropzone id="zone">
        <span>Drop here</span>
      </Dropzone>,
    );
    const zone = container.querySelector('[data-slot="dropzone"]');
    expect(zone).toBeInTheDocument();
    expect(zone).not.toHaveAttribute('data-over');
  });

  it('has no axe violations', async () => {
    const { container } = renderInContext(
      <Dropzone id="zone">
        <span>Drop here</span>
      </Dropzone>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
