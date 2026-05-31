import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Input } from './input';
import { Label } from './label';

const meta = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  args: { placeholder: 'name@company.com' },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true, value: 'disabled value' },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="email">Business Email</Label>
      <Input id="email" className="h-11 bg-secondary" {...args} />
    </div>
  ),
};
