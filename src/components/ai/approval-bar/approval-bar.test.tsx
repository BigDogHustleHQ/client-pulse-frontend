import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { ApprovalBar } from './approval-bar';

describe('ApprovalBar', () => {
  it('fires onApprove with the value', async () => {
    const onApprove = jest.fn();
    render(<ApprovalBar value="Hello there" onApprove={onApprove} />);
    await userEvent.click(screen.getByRole('button', { name: /approve/i }));
    expect(onApprove).toHaveBeenCalledWith('Hello there');
  });

  it('fires onReject', async () => {
    const onReject = jest.fn();
    render(<ApprovalBar value="Hello there" onReject={onReject} />);
    await userEvent.click(screen.getByRole('button', { name: /reject/i }));
    expect(onReject).toHaveBeenCalledTimes(1);
  });

  it('fires onEdit with the edited value after editing and saving', async () => {
    const onEdit = jest.fn();
    render(<ApprovalBar value="Hello" onEdit={onEdit} />);

    await userEvent.click(screen.getByRole('button', { name: /edit/i }));
    const editor = screen.getByLabelText('Edit draft');
    await userEvent.clear(editor);
    await userEvent.type(editor, 'Hello, world');
    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(onEdit).toHaveBeenCalledWith('Hello, world');
  });

  it('cancel discards edits and does not fire onEdit', async () => {
    const onEdit = jest.fn();
    render(<ApprovalBar value="Hello" onEdit={onEdit} />);
    await userEvent.click(screen.getByRole('button', { name: /edit/i }));
    await userEvent.type(screen.getByLabelText('Edit draft'), '!!!');
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onEdit).not.toHaveBeenCalled();
    expect(
      screen.getByRole('button', { name: /approve/i }),
    ).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<ApprovalBar value="Draft text" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
