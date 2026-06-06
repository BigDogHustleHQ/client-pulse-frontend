import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Plus } from 'lucide-react';
import { Btn } from './btn';

const meta = {
  title: 'Primitives/Button',
  component: Btn,
  tags: ['autodocs'],
  args: { children: 'Save changes' },
} satisfies Meta<typeof Btn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Loading: Story = { args: { loading: true } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const WithIcon: Story = {
  render: (a) => (
    <Btn {...a}>
      <Plus /> New reservation
    </Btn>
  ),
};
