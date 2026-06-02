import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ToneSlider } from './tone-slider';

const meta = {
  title: 'AI/ToneSlider',
  component: ToneSlider,
  tags: ['autodocs'],
  args: { value: 50, onChange: () => {} },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ToneSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

const Controlled = (
  props: Partial<React.ComponentProps<typeof ToneSlider>>,
) => {
  const [value, setValue] = React.useState(props.value ?? 50);
  return <ToneSlider {...props} value={value} onChange={setValue} />;
};

export const Default: Story = {
  render: () => <Controlled />,
};

export const FiveStops: Story = {
  render: () => (
    <Controlled
      label="Voice"
      value={25}
      stops={['Formal', 'Professional', 'Friendly', 'Casual', 'Playful']}
    />
  ),
};
