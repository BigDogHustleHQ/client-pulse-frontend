import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { AIReplyDraft } from './ai-reply-draft';
import { MockAIProvider } from '../mock-ai-provider/mock-ai-provider';

const TOKENS = ['Draft ', 'reply ', 'body'];

const renderDraft = (
  props: Partial<React.ComponentProps<typeof AIReplyDraft>> = {},
) => {
  return render(
    <MockAIProvider tokens={TOKENS} delay={0}>
      <AIReplyDraft prompt="reply to review" {...props} />
    </MockAIProvider>,
  );
};

describe('AIReplyDraft', () => {
  it('populates the editable textbox with the AI draft', async () => {
    renderDraft();
    expect(await screen.findByDisplayValue('Draft reply body')).toBeEnabled();
  });

  it('submits with the drafted value', async () => {
    const onSubmit = vi.fn();
    renderDraft({ onSubmit });
    await screen.findByDisplayValue('Draft reply body');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(onSubmit).toHaveBeenCalledWith('Draft reply body');
  });

  it('shows sent feedback after submitting', async () => {
    renderDraft();
    await screen.findByDisplayValue('Draft reply body');
    const submit = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submit);
    expect(await screen.findByRole('button', { name: /sent/i })).toBeDisabled();
  });

  it('lets the user edit the draft inline before submitting', async () => {
    const onSubmit = vi.fn();
    const onChange = vi.fn();
    renderDraft({ onSubmit, onChange });
    const box = await screen.findByDisplayValue('Draft reply body');
    await userEvent.clear(box);
    await userEvent.type(box, 'Edited reply');
    expect(onChange).toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(onSubmit).toHaveBeenCalledWith('Edited reply');
  });

  it('requests a fresh draft via regenerate', async () => {
    const onRegenerate = vi.fn();
    renderDraft({ onRegenerate });
    await screen.findByDisplayValue('Draft reply body');
    await userEvent.click(screen.getByRole('button', { name: /regenerate/i }));
    expect(onRegenerate).toHaveBeenCalled();
    // The mock re-runs and repopulates the textbox.
    expect(await screen.findByDisplayValue('Draft reply body')).toBeEnabled();
  });

  it('disables Submit while there is no draft text', () => {
    renderDraft({ autoDraft: false });
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('has no axe violations', async () => {
    const { container } = renderDraft();
    await screen.findByDisplayValue('Draft reply body');
    expect(await axe(container)).toHaveNoViolations();
  });
});
