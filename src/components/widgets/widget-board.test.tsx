import * as React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { axe } from 'jest-axe';
import { FileText } from 'lucide-react';
import { WidgetBoard } from './widget-board';
import { useWidgetLayout, widgetStorageKey } from './use-widget-layout';
import type { WidgetCatalog, WidgetInstance } from './types';

type Demo = { name: string };

const catalog: WidgetCatalog<Demo> = [
  {
    type: 'alpha',
    label: 'Alpha',
    description: 'First widget',
    icon: FileText,
    defaultSize: 'sm',
    render: (d) => <div data-testid="alpha">Alpha · {d.name}</div>,
  },
  {
    type: 'beta',
    label: 'Beta',
    description: 'Second widget',
    icon: FileText,
    defaultSize: 'md',
    render: () => <div data-testid="beta">Beta</div>,
  },
];

const defaults = (): WidgetInstance[] => [{ id: 'alpha', type: 'alpha' }];

function setup(page = 'test') {
  return render(
    <WidgetBoard<Demo>
      page={page}
      title="Demo"
      data={{ name: 'Maria' }}
      catalog={catalog}
      defaultLayout={defaults}
    />,
  );
}

describe('WidgetBoard', () => {
  beforeEach(() => window.localStorage.clear());

  it('seeds the default layout and renders widget bodies', () => {
    setup();
    expect(screen.getByTestId('alpha')).toHaveTextContent('Alpha · Maria');
    expect(screen.queryByTestId('beta')).not.toBeInTheDocument();
  });

  it('starts in view mode with no remove/drag controls until editing', () => {
    setup();
    expect(screen.queryByLabelText(/Remove/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Edit layout'));
    expect(screen.getByText('Done')).toBeInTheDocument();
    expect(screen.getByLabelText('Remove Alpha')).toBeInTheDocument();
    expect(screen.getByLabelText('Reorder Alpha')).toBeInTheDocument();
  });

  it('removes a widget via its remove control', () => {
    setup();
    fireEvent.click(screen.getByText('Edit layout'));
    fireEvent.click(screen.getByLabelText('Remove Alpha'));
    expect(screen.queryByTestId('alpha')).not.toBeInTheDocument();
    expect(screen.getByText(/No widgets yet/)).toBeInTheDocument();
  });

  it('persists the layout to localStorage under cp:widgets:<page>', () => {
    setup('persisttest');
    fireEvent.click(screen.getByText('Edit layout'));
    fireEvent.click(screen.getByLabelText('Remove Alpha'));
    const raw = window.localStorage.getItem(widgetStorageKey('persisttest'));
    expect(raw).toBe('[]');
  });

  it('hydrates from a stored layout instead of defaults', () => {
    window.localStorage.setItem(
      widgetStorageKey('hydrate'),
      JSON.stringify([{ id: 'beta', type: 'beta' }]),
    );
    setup('hydrate');
    expect(screen.getByTestId('beta')).toBeInTheDocument();
    expect(screen.queryByTestId('alpha')).not.toBeInTheDocument();
  });

  it('has no axe violations in edit mode', async () => {
    const { container } = setup();
    fireEvent.click(screen.getByText('Edit layout'));
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('useWidgetLayout', () => {
  beforeEach(() => window.localStorage.clear());

  function Harness() {
    const { layout, addWidget, removeWidget, reorder, reset } = useWidgetLayout(
      'hook',
      catalog,
      defaults,
    );
    return (
      <div>
        <span data-testid="order">{layout.map((w) => w.type).join(',')}</span>
        <button onClick={() => addWidget('beta')}>add-beta</button>
        <button onClick={() => removeWidget(layout[0]?.id)}>
          remove-first
        </button>
        <button
          onClick={() => reorder(layout[0]?.id, layout[layout.length - 1]?.id)}
        >
          move-first-to-last
        </button>
        <button onClick={reset}>reset</button>
      </div>
    );
  }

  it('adds, reorders, removes and resets instances', () => {
    render(<Harness />);
    expect(screen.getByTestId('order')).toHaveTextContent('alpha');

    act(() => {
      fireEvent.click(screen.getByText('add-beta'));
    });
    expect(screen.getByTestId('order')).toHaveTextContent('alpha,beta');

    act(() => {
      fireEvent.click(screen.getByText('move-first-to-last'));
    });
    expect(screen.getByTestId('order')).toHaveTextContent('beta,alpha');

    act(() => {
      fireEvent.click(screen.getByText('remove-first'));
    });
    expect(screen.getByTestId('order')).toHaveTextContent('alpha');

    act(() => {
      fireEvent.click(screen.getByText('reset'));
    });
    expect(screen.getByTestId('order')).toHaveTextContent('alpha');
  });
});
