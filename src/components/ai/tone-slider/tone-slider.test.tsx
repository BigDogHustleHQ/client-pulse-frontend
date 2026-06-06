import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ToneSlider } from './tone-slider';

describe('ToneSlider', () => {
  it('fires onChange with the new numeric value', () => {
    const onChange = vi.fn();
    render(<ToneSlider value={0} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Tone'), {
      target: { value: '100' },
    });
    expect(onChange).toHaveBeenCalledWith(100);
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

  it('snaps an off-grid value to the nearest stop on change', () => {
    const onChange = vi.fn();
    render(
      <ToneSlider
        value={0}
        onChange={onChange}
        stops={['Formal', 'Professional', 'Friendly', 'Casual', 'Playful']}
      />,
    );
    // 5 stops over 0..100 → stops at 0/25/50/75/100; raw 60 snaps to 50.
    fireEvent.change(screen.getByLabelText('Tone'), {
      target: { value: '60' },
    });
    expect(onChange).toHaveBeenCalledWith(50);
  });

  it('constrains the input step to the stop spacing', () => {
    render(
      <ToneSlider
        value={0}
        onChange={() => {}}
        stops={['Formal', 'Professional', 'Friendly', 'Casual', 'Playful']}
      />,
    );
    // 5 stops over 0..100 → one step per stop gap = 25.
    expect(screen.getByLabelText('Tone')).toHaveAttribute('step', '25');
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
