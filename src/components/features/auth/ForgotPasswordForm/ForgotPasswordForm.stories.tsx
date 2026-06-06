import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import ForgotPasswordForm from './ForgotPasswordForm';

const meta = {
  title: 'Auth/ForgotPasswordForm',
  component: ForgotPasswordForm,
  parameters: {
    layout: 'centered',
  },
  args: {
    onStepChange: fn(),
  },
} satisfies Meta<typeof ForgotPasswordForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// Step 1 — the email entry screen the user first lands on.
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Reset Password')).toBeInTheDocument();
    await expect(canvas.getByLabelText('Email Address')).toBeInTheDocument();
    await expect(
      canvas.getByRole('button', { name: /send reset link/i }),
    ).toBeInTheDocument();
  },
};

// Full happy-path walk: email → code → new password → success screen.
// Clerk is stubbed (see .storybook/mocks/clerk-nextjs.tsx) so each step resolves.
export const CompleteFlow: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    // Step 1: email
    await userEvent.type(
      canvas.getByLabelText('Email Address'),
      'owner@business.com',
    );
    await userEvent.click(
      canvas.getByRole('button', { name: /send reset link/i }),
    );

    // Step 2: verification code
    await userEvent.type(
      await canvas.findByLabelText('Verification Code'),
      '123456',
    );
    await userEvent.click(canvas.getByRole('button', { name: /verify code/i }));

    // Step 3: new password
    await userEvent.type(
      await canvas.findByLabelText('New Password'),
      'n3wp4ssw0rd',
    );
    await userEvent.type(
      canvas.getByLabelText('Confirm Password'),
      'n3wp4ssw0rd',
    );
    await userEvent.click(
      canvas.getByRole('button', { name: /reset password/i }),
    );

    // Success screen
    await expect(
      await canvas.findByText('Password Updated!'),
    ).toBeInTheDocument();
    await expect(args.onStepChange).toHaveBeenCalled();
  },
};

// Validation: mismatched passwords on the final step surface an inline error.
export const PasswordMismatch: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(
      canvas.getByLabelText('Email Address'),
      'owner@business.com',
    );
    await userEvent.click(
      canvas.getByRole('button', { name: /send reset link/i }),
    );

    await userEvent.type(
      await canvas.findByLabelText('Verification Code'),
      '123456',
    );
    await userEvent.click(canvas.getByRole('button', { name: /verify code/i }));

    await userEvent.type(
      await canvas.findByLabelText('New Password'),
      'n3wp4ssw0rd',
    );
    await userEvent.type(
      canvas.getByLabelText('Confirm Password'),
      'does-not-match',
    );
    await userEvent.click(
      canvas.getByRole('button', { name: /reset password/i }),
    );

    await expect(
      await canvas.findByText('Passwords do not match.'),
    ).toBeInTheDocument();
  },
};
