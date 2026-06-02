import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { ChatComposer } from './chat-composer';
import { MockAIProvider } from '../mock-ai-provider/mock-ai-provider';

const TOKENS = ['Sure', ', ', 'happy ', 'to ', 'help', '.'];

const renderComposer = (ui = <ChatComposer />) => {
  return render(
    <MockAIProvider tokens={TOKENS} delay={0}>
      {ui}
    </MockAIProvider>,
  );
};

describe('ChatComposer', () => {
  it('streams the response after submitting', async () => {
    const user = userEvent.setup();
    renderComposer();

    await user.type(screen.getByLabelText('Prompt'), 'Write a reply');
    await user.click(screen.getByRole('button', { name: /send/i }));

    expect(await screen.findByText('Sure, happy to help.')).toBeInTheDocument();
  });

  it('disables send while there is no prompt', () => {
    renderComposer();
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled();
  });

  it('fires onResponse with the full text', async () => {
    const onResponse = jest.fn();
    const user = userEvent.setup();
    renderComposer(<ChatComposer onResponse={onResponse} />);

    await user.type(screen.getByLabelText('Prompt'), 'hi');
    await user.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() =>
      expect(onResponse).toHaveBeenCalledWith('Sure, happy to help.'),
    );
  });

  it('has no axe violations', async () => {
    const { container } = renderComposer();
    expect(await axe(container)).toHaveNoViolations();
  });
});
