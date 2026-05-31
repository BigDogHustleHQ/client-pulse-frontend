import { buildSiteHtml } from './build-site-html';
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
    surface: '#ffffff',
    text: '#2b211a',
    muted: '#8a7a6c',
    accent: '#c2562e',
    accentText: '#ffffff',
  },
];

const fontPairs: WebsiteFontPair[] = [
  { id: 'classic', label: 'Classic', heading: 'Georgia, serif', body: 'serif' },
];

function makeConfig(overrides: Partial<WebsiteConfig> = {}): WebsiteConfig {
  return {
    brandName: 'Bella',
    tagline: 'Tagline here',
    heroCta: 'Book now',
    aboutText: 'About us text',
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
    contact: '123 Main St',
    ...overrides,
  };
}

describe('buildSiteHtml', () => {
  it('renders config content into the document', () => {
    const html = buildSiteHtml(makeConfig(), palettes, fontPairs);
    expect(html).toContain('Bella');
    expect(html).toContain('Tagline here');
    expect(html).toContain('Book now');
    expect(html).toContain('Pizza');
    expect(html).toContain('$10');
    expect(html).toContain('123 Main St');
  });

  it('omits sections that are toggled off', () => {
    const html = buildSiteHtml(
      makeConfig({
        sections: {
          hero: true,
          about: true,
          menu: false,
          hours: true,
          gallery: true,
          reviews: true,
          contact: true,
        },
      }),
      palettes,
      fontPairs,
    );
    expect(html).not.toContain('Pizza');
    expect(html).toContain('Our story');
  });

  it('renders the requested number of gallery tiles', () => {
    const html = buildSiteHtml(
      makeConfig({ galleryCount: 3 }),
      palettes,
      fontPairs,
    );
    expect(html.match(/class="tile"/g)).toHaveLength(3);
  });

  it('escapes HTML in user content to prevent breaking the markup', () => {
    const html = buildSiteHtml(
      makeConfig({ brandName: '<script>alert(1)</script>' }),
      palettes,
      fontPairs,
    );
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('uses the accent color override', () => {
    const html = buildSiteHtml(
      makeConfig({ accentColor: '#123456' }),
      palettes,
      fontPairs,
    );
    expect(html).toContain('--accent: #123456');
  });
});
