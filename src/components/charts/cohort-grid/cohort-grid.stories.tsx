import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CohortGrid } from './cohort-grid';

const meta = {
  title: 'Charts/CohortGrid',
  component: CohortGrid,
  tags: ['autodocs'],
  // Cells are intentionally tinted by retention intensity (data signal) using
  // brand-color alpha, so contrast varies with the data and the dashes in
  // missing cells are decorative. axe color-contrast doesn't model data viz;
  // the cell values remain readable and have `aria-label` for screen readers.
  parameters: {
    a11y: {
      config: { rules: [{ id: 'color-contrast', enabled: false }] },
    },
  },
} satisfies Meta<typeof CohortGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    periodLabel: (i) => `Mo ${i}`,
    data: [
      { label: 'Jan', size: 320, retention: [100, 62, 48, 41, 38, 35] },
      { label: 'Feb', size: 410, retention: [100, 66, 51, 44, 40] },
      { label: 'Mar', size: 380, retention: [100, 59, 46, 39] },
      { label: 'Apr', size: 450, retention: [100, 64, 50] },
      { label: 'May', size: 510, retention: [100, 68] },
    ],
    className: 'max-w-2xl',
  },
};

export const PartialPeriods: Story = {
  args: {
    data: [
      { label: 'Week 1', size: 120, retention: [100, 55, 40] },
      { label: 'Week 2', size: 140, retention: [100, 58] },
      { label: 'Week 3', size: 160, retention: [100] },
    ],
    className: 'max-w-md',
  },
};

export const Empty: Story = {
  args: {
    data: [],
    className: 'max-w-md',
  },
};
