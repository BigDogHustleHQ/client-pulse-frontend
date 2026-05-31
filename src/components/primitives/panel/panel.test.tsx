import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Panel, PanelHead } from './panel';

describe('Panel', () => {
  it('renders head title, description, and actions', () => {
    render(
      <Panel>
        <PanelHead
          title="Covers"
          description="Today"
          actions={<button>Act</button>}
        />
      </Panel>,
    );
    expect(screen.getByRole('heading', { name: 'Covers' })).toBeInTheDocument();
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Act' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Panel>
        <PanelHead title="Covers" description="Today" />
      </Panel>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
