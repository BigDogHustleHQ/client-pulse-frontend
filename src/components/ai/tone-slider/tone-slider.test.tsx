import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ToneSlider } from './tone-slider';

describe('ToneSlider', () => {
  it('fires onChange with the new numeric value', () => {
    const onChange = jest.fn();
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
