import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

const meta = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Monthly revenue</CardTitle>
        <CardDescription>Compared to last month</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold tracking-tight">$48,200</p>
        <p className="text-sm text-muted-foreground">+12.4% vs. April</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">View report</Button>
      </CardFooter>
    </Card>
  ),
};
