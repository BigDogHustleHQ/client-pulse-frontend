import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { AIReplyDraft, confidenceTone } from './ai-reply-draft';
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
  it('renders the AI-drafted body', async () => {
    renderDraft();
    expect(await screen.findByText('Draft reply body')).toBeInTheDocument();
  });

  it('shows a confidence pill', async () => {
    renderDraft({ confidence: 0.9 });
    expect(await screen.findByText('90% confident')).toBeInTheDocument();
  });

  it('approves with the drafted value', async () => {
    const onApprove = jest.fn();
    renderDraft({ onApprove });
    await screen.findByText('Draft reply body');
    await userEvent.click(screen.getByRole('button', { name: /approve/i }));
    expect(onApprove).toHaveBeenCalledWith('Draft reply body');
  });

  it('confidenceTone thresholds', () => {
    expect(confidenceTone(0.9)).toBe('success');
    expect(confidenceTone(0.6)).toBe('warning');
    expect(confidenceTone(0.2)).toBe('danger');
  });

  it('has no axe violations', async () => {
    const { container } = renderDraft();
    await screen.findByText('Draft reply body');
    expect(await axe(container)).toHaveNoViolations();
  });
});
