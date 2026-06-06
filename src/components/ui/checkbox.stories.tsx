import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Checkbox } from './checkbox';
import { Label } from './label';

const meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// Even a "standalone" Checkbox needs a discernible name for screen readers
// (Radix Checkbox renders a real <button role="checkbox">). Pass aria-label
// for the isolated demos; the WithLabel story shows the more common <Label>
// association pattern.
export const Default: Story = {
  args: { 'aria-label': 'Subscribe to newsletter' },
};

export const Checked: Story = {
  args: { 'aria-label': 'Remember me', defaultChecked: true },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="remember" defaultChecked />
      <Label htmlFor="remember" className="cursor-pointer font-normal">
        Remember me
      </Label>
    </div>
  ),
};
