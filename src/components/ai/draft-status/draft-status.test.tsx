import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { DraftStatus } from './draft-status';

describe('DraftStatus', () => {
  it('shows the approved message when resolution is approved', () => {
    render(<DraftStatus resolution="approved" />);
    const banner = screen.getByRole('status');
    expect(banner).toHaveAttribute('data-resolution', 'approved');
    expect(banner).toHaveTextContent(/queued to send/i);
  });

  it('shows the rejected message when resolution is rejected', () => {
    render(<DraftStatus resolution="rejected" />);
    const banner = screen.getByRole('status');
    expect(banner).toHaveAttribute('data-resolution', 'rejected');
    expect(banner).toHaveTextContent(/dismissed/i);
  });

  it('respects custom labels', () => {
    render(
      <DraftStatus
        resolution="approved"
        approvedLabel="Sent to Google"
        rejectedLabel="Skipped"
      />,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Sent to Google');
  });

  it('renders Undo only when onUndo is provided and fires it', async () => {
    const onUndo = jest.fn();
    const { rerender } = render(<DraftStatus resolution="approved" />);
    expect(
      screen.queryByRole('button', { name: /undo/i }),
    ).not.toBeInTheDocument();

    rerender(<DraftStatus resolution="approved" onUndo={onUndo} />);
    await userEvent.click(screen.getByRole('button', { name: /undo/i }));
    expect(onUndo).toHaveBeenCalledTimes(1);
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <DraftStatus resolution="approved" onUndo={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
