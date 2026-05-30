import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import LoginForm from './LoginForm';

const meta = {
  title: 'Auth/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Welcome back')).toBeInTheDocument();
    await expect(canvas.getByLabelText('Business Email')).toBeInTheDocument();
    await expect(canvas.getByLabelText('Password')).toBeInTheDocument();
    await expect(
      canvas.getByRole('button', { name: 'Sign in to platform' }),
    ).toBeInTheDocument();
  },
};

export const FilledOut: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      canvas.getByLabelText('Business Email'),
      'owner@business.com',
    );
    await userEvent.type(canvas.getByLabelText('Password'), 'sup3rsecret');

    await expect(canvas.getByLabelText('Business Email')).toHaveValue(
      'owner@business.com',
    );
  },
};

export const PasswordVisible: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const password = canvas.getByLabelText('Password');
    await expect(password).toHaveAttribute('type', 'password');

    await userEvent.click(canvas.getByLabelText('Show password'));
    await expect(password).toHaveAttribute('type', 'text');
  },
};
