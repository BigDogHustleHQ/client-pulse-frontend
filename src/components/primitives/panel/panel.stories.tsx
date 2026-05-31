import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '@/components/ui/button';
import { Panel, PanelHead } from './panel';

const meta = {
  title: 'Primitives/Panel',
  component: Panel,
  tags: ['autodocs'],
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Panel className="w-96">
      <PanelHead title="Today's covers" description="Across all services" />
      <p className="text-sm text-muted-foreground">
        Panel body content goes here.
      </p>
    </Panel>
  ),
};

export const WithActions: Story = {
  render: () => (
    <Panel className="w-96">
      <PanelHead
        title="Reservations"
        description="Next 7 days"
        actions={
          <Button size="sm" variant="outline">
            View all
          </Button>
        }
      />
      <p className="text-sm text-muted-foreground">
        Panel with a header action.
      </p>
    </Panel>
  ),
};
