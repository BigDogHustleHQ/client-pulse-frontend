import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ToneSlider } from './tone-slider';

const FIVE_STOPS = ['Formal', 'Professional', 'Friendly', 'Casual', 'Playful'];

describe('ToneSlider', () => {
  it('commits a snapped value when the drag is released', () => {
    const onChange = vi.fn();
    render(<ToneSlider value={0} onChange={onChange} stops={FIVE_STOPS} />);
    const input = screen.getByLabelText('Tone');
    // Drag to an off-grid value...
    fireEvent.change(input, { target: { value: '60' } });
    // ...no commit yet — onChange waits for release so the drag stays free.
    expect(onChange).not.toHaveBeenCalled();
    // Release snaps to the nearest stop (5 stops → 0/25/50/75/100; 60 → 50).
    fireEvent.pointerUp(input);
    expect(onChange).toHaveBeenCalledWith(50);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('commits on blur if pointer never lifts inside', () => {
    const onChange = vi.fn();
    render(<ToneSlider value={0} onChange={onChange} stops={FIVE_STOPS} />);
    const input = screen.getByLabelText('Tone');
    fireEvent.change(input, { target: { value: '90' } });
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith(100); // snaps to last stop
  });

  it('keyboard arrows move and commit one stop at a time', () => {
    const onChange = vi.fn();
    render(<ToneSlider value={0} onChange={onChange} stops={FIVE_STOPS} />);
    const input = screen.getByLabelText('Tone');
    fireEvent.keyDown(input, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenLastCalledWith(25);
    fireEvent.keyDown(input, { key: 'End' });
    expect(onChange).toHaveBeenLastCalledWith(100);
    fireEvent.keyDown(input, { key: 'Home' });
    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  it('does not set a native step so the drag stays smooth', () => {
    render(<ToneSlider value={50} onChange={() => {}} stops={FIVE_STOPS} />);
    // With no step, the browser allows any value during a drag; the
    // component snaps to the nearest stop on release.
    expect(screen.getByLabelText('Tone')).not.toHaveAttribute('step');
  });

  it('shows the tone label for the current value', () => {
    const { container } = render(
      <ToneSlider value={100} onChange={() => {}} />,
    );
    expect(
      container.querySelector('[data-slot="tone-slider-value"]'),
    ).toHaveTextContent('Casual');
    expect(screen.getByLabelText('Tone')).toHaveAttribute(
      'aria-valuetext',
      'Casual',
    );
  });

  it('maps mid value to the middle stop', () => {
    render(<ToneSlider value={50} onChange={() => {}} />);
    expect(screen.getByLabelText('Tone')).toHaveAttribute(
      'aria-valuetext',
      'Friendly',
    );
  });

  it('has no axe violations', async () => {
    const { container } = render(<ToneSlider value={50} onChange={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
