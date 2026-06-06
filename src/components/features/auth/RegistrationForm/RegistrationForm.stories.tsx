import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import RegistrationForm from './RegistrationForm';

const meta = {
  title: 'Auth/RegistrationForm',
  component: RegistrationForm,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof RegistrationForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Create your account')).toBeInTheDocument();
    await expect(canvas.getByLabelText('First Name')).toBeInTheDocument();
    await expect(canvas.getByLabelText('Business Email')).toBeInTheDocument();
    await expect(
      canvas.getByRole('button', { name: 'Create account' }),
    ).toBeInTheDocument();
  },
};

export const FilledOut: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('First Name'), 'Jordan');
    await userEvent.type(canvas.getByLabelText('Last Name'), 'Rivera');
    await userEvent.type(
      canvas.getByLabelText('Business Email'),
      'jordan@business.com',
    );
    await userEvent.type(canvas.getByLabelText('Password'), 'sup3rsecret');

    await expect(canvas.getByLabelText('First Name')).toHaveValue('Jordan');
  },
};
