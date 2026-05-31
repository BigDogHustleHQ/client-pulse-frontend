import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { LivePreview } from './live-preview';
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
];

const fontPairs: WebsiteFontPair[] = [
  { id: 'classic', label: 'Classic', heading: 'serif', body: 'serif' },
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
  menu: [{ name: 'Pizza', description: 'Cheesy', price: '$10' }],
  hours: [{ day: 'Mon', hours: '5-10' }],
  reviews: [{ quote: 'Great', author: 'Sam', rating: 5 }],
  galleryCount: 4,
  contact: '123 Main',
};

describe('LivePreview', () => {
  it('renders an iframe whose srcDoc reflects the config', () => {
    render(
      <LivePreview
        config={config}
        palettes={palettes}
        fontPairs={fontPairs}
        device="desktop"
      />,
    );
    const iframe = screen.getByTitle('Bella preview') as HTMLIFrameElement;
    expect(iframe).toBeInTheDocument();
    expect(iframe.getAttribute('srcdoc')).toContain('Pizza');
  });

  it('exposes the device on the preview slot', () => {
    const { container } = render(
      <LivePreview
        config={config}
        palettes={palettes}
        fontPairs={fontPairs}
        device="mobile"
      />,
    );
    expect(
      container.querySelector('[data-slot="website-preview"]'),
    ).toHaveAttribute('data-device', 'mobile');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <LivePreview
        config={config}
        palettes={palettes}
        fontPairs={fontPairs}
        device="desktop"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
