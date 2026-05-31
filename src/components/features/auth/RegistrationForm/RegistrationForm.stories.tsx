import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import RegistrationForm from './RegistrationForm';

const meta = {
  title: 'Auth/RegistrationForm',
  component: RegistrationForm,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof RegistrationForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
