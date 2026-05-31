import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { Tag } from 'lucide-react';
import { Chip } from './chip';

const meta = {
  title: 'Primitives/Chip',
  component: Chip,
  tags: ['autodocs'],
  args: { children: 'Vegetarian', onRemove: fn() },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Removable: Story = {};
export const Static: Story = { args: { onRemove: undefined } };
export const WithLeadingIcon: Story = {
  args: { leading: <Tag className="size-3.5 text-muted-foreground" /> },
};
export const Group: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {['Vegan', 'Gluten-free', 'Spicy', 'Popular'].map((t) => (
        <Chip key={t} onRemove={() => {}}>
          {t}
        </Chip>
      ))}
    </div>
  ),
};
