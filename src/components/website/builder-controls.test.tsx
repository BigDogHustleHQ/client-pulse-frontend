import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { BuilderControls } from './builder-controls';
import type {
  WebsiteConfig,
  WebsiteFontPair,
  WebsitePalette,
} from '@/types/website';

const palettes: WebsitePalette[] = [
  {
    id: 'warm',
    label: 'Warm',
    bg: '#fbf6ef',
    surface: '#fff',
    text: '#000',
    muted: '#888',
    accent: '#c2562e',
    accentText: '#fff',
  },
  {
    id: 'modern',
    label: 'Modern',
    bg: '#0f1115',
    surface: '#181b22',
    text: '#fff',
    muted: '#9aa3b2',
    accent: '#6d8bff',
    accentText: '#000',
  },
];

const fontPairs: WebsiteFontPair[] = [
  { id: 'classic', label: 'Classic serif', heading: 'serif', body: 'serif' },
  { id: 'modern', label: 'Modern sans', heading: 'sans', body: 'sans' },
];

const config: WebsiteConfig = {
  brandName: 'Bella',
  tagline: 'Tagline',
  heroCta: 'Book',
  aboutText: 'About',
  paletteId: 'warm',
  accentColor: '#c2562e',
  fontPairId: 'classic',
  sections: {
    hero: true,
    about: true,
    menu: true,
    hours: true,
    gallery: true,
    reviews: true,
    contact: true,
  },
  menu: [],
  hours: [],
  reviews: [],
  galleryCount: 6,
  contact: '123 Main',
};

describe('BuilderControls', () => {
  it('emits a brand name patch when the brand field changes', async () => {
    const onChange = jest.fn();
    render(
      <BuilderControls
        config={config}
        palettes={palettes}
        fontPairs={fontPairs}
        onChange={onChange}
      />,
    );
    await userEvent.type(screen.getByLabelText('Brand name'), 'X');
    expect(onChange).toHaveBeenCalledWith({ brandName: 'BellaX' });
  });

  it('applies a palette and its accent when a palette is chosen', async () => {
    const onChange = jest.fn();
    render(
      <BuilderControls
        config={config}
        palettes={palettes}
        fontPairs={fontPairs}
        onChange={onChange}
      />,
    );
    await userEvent.click(screen.getByRole('radio', { name: /Modern/ }));
    expect(onChange).toHaveBeenCalledWith({
      paletteId: 'modern',
      accentColor: '#6d8bff',
    });
  });

  it('toggles a section off', async () => {
    const onChange = jest.fn();
    render(
      <BuilderControls
        config={config}
        palettes={palettes}
        fontPairs={fontPairs}
        onChange={onChange}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Menu' }));
    expect(onChange).toHaveBeenCalledWith({
      sections: { ...config.sections, menu: false },
    });
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <BuilderControls
        config={config}
        palettes={palettes}
        fontPairs={fontPairs}
        onChange={() => {}}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
