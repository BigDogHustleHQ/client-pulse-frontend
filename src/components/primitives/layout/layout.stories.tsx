import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Stack, Inline, Grid } from './layout';
import { Pill } from '../pill/pill';

const meta = {
  title: 'Primitives/Layout',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const Box = ({ children }: { children: React.ReactNode }) => (
  <div className="grid h-12 place-content-center rounded-lg bg-secondary text-sm text-muted-foreground">
    {children}
  </div>
);

export const StackStory: Story = {
  name: 'Stack',
  render: () => (
    <Stack gap="sm" className="w-48">
      <Box>One</Box>
      <Box>Two</Box>
      <Box>Three</Box>
    </Stack>
  ),
};

export const InlineStory: Story = {
  name: 'Inline',
  render: () => (
    <Inline gap="sm">
      <Pill tone="brand">Tag</Pill>
      <Pill tone="success">Tag</Pill>
      <Pill tone="info">Tag</Pill>
    </Inline>
  ),
};

export const GridStory: Story = {
  name: 'Grid',
  render: () => (
    <Grid cols={3} gap="md" className="w-96">
      <Box>1</Box>
      <Box>2</Box>
      <Box>3</Box>
      <Box>4</Box>
      <Box>5</Box>
      <Box>6</Box>
    </Grid>
  ),
};
