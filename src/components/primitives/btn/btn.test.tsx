import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Btn } from './btn';

describe('Btn', () => {
  it('fires onClick', () => {
    const onClick = jest.fn();
    render(<Btn onClick={onClick}>Save</Btn>);
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('disables and marks busy while loading', () => {
    render(<Btn loading>Save</Btn>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
  });

  it('does not fire onClick while loading', () => {
    const onClick = jest.fn();
    render(
      <Btn loading onClick={onClick}>
        Save
      </Btn>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('has no axe violations', async () => {
    const { container } = render(<Btn>Save</Btn>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
