import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Chip } from './chip';

describe('Chip', () => {
  it('renders its content', () => {
    render(<Chip>Vegan</Chip>);
    expect(screen.getByText('Vegan')).toBeInTheDocument();
  });

  it('fires onRemove when the remove button is clicked', () => {
    const onRemove = vi.fn();
    render(<Chip onRemove={onRemove}>Vegan</Chip>);
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('omits the remove button when no handler is given', () => {
    render(<Chip>Static</Chip>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<Chip onRemove={() => {}}>Vegan</Chip>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
