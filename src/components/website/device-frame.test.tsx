import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { DeviceToggle } from './device-frame';

describe('DeviceToggle', () => {
  it('renders three device options with the selected one checked', () => {
    render(<DeviceToggle value="desktop" onChange={() => {}} />);
    expect(screen.getByRole('radio', { name: 'Desktop' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByRole('radio', { name: 'Mobile' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
  });

  it('calls onChange with the chosen device', async () => {
    const onChange = jest.fn();
    render(<DeviceToggle value="desktop" onChange={onChange} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Mobile' }));
    expect(onChange).toHaveBeenCalledWith('mobile');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <DeviceToggle value="tablet" onChange={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
