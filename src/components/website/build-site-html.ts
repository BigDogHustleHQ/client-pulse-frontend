import type {
  WebsiteConfig,
  WebsiteFontPair,
  WebsitePalette,
} from '@/types/website';

/** HTML-escape a string for safe interpolation into the generated srcDoc. */
function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function star(rating: number): string {
  const full = Math.max(0, Math.min(5, Math.round(rating)));
  return '★★★★★☆☆☆☆☆'.slice(5 - full, 10 - full);
}

/**
 * Build a complete, dependency-free HTML document for a mini restaurant
 * landing page from the editable config. The result is fed to an
 * `<iframe srcDoc>` so the preview renders as a real, isolated page.
 *
 * Pure and SSR-safe — no `window`/`document` access.
 */
export function buildSiteHtml(
  config: WebsiteConfig,
  palettes: WebsitePalette[],
  fontPairs: WebsiteFontPair[],
): string {
  const palette =
    palettes.find((p) => p.id === config.paletteId) ?? palettes[0];
  const fonts =
    fontPairs.find((f) => f.id === config.fontPairId) ?? fontPairs[0];
  const accent = config.accentColor || palette.accent;
  const { sections } = config;

  const hero = sections.hero
    ? `
    <header class="hero">
      <div class="hero-inner">
        <p class="eyebrow">${esc(config.tagline)}</p>
        <h1>${esc(config.brandName)}</h1>
        <a class="btn" href="#">${esc(config.heroCta)}</a>
      </div>
    </header>`
    : '';

  const about = sections.about
    ? `
    <section class="section about" aria-label="About">
      <h2>Our story</h2>
      <p>${esc(config.aboutText)}</p>
    </section>`
    : '';

  const menu = sections.menu
    ? `
    <section class="section menu" aria-label="Menu">
      <h2>Menu</h2>
      <ul class="menu-list">
        ${config.menu
          .map(
            (item) => `
        <li class="menu-item">
          <div class="menu-line">
            <span class="menu-name">${esc(item.name)}</span>
            <span class="menu-dots" aria-hidden="true"></span>
            <span class="menu-price">${esc(item.price)}</span>
          </div>
          <p class="menu-desc">${esc(item.description)}</p>
        </li>`,
          )
          .join('')}
      </ul>
    </section>`
    : '';

  const hours = sections.hours
    ? `
    <section class="section hours" aria-label="Hours">
      <h2>Hours</h2>
      <table class="hours-table">
        ${config.hours
          .map(
            (row) =>
              `<tr><th scope="row">${esc(row.day)}</th><td>${esc(row.hours)}</td></tr>`,
          )
          .join('')}
      </table>
    </section>`
    : '';

  const gallery = sections.gallery
    ? `
    <section class="section gallery" aria-label="Gallery">
      <h2>Gallery</h2>
      <div class="gallery-grid">
        ${Array.from({ length: Math.max(0, config.galleryCount) })
          .map((_, i) => `<div class="tile" aria-label="Photo ${i + 1}"></div>`)
          .join('')}
      </div>
    </section>`
    : '';

  const reviews = sections.reviews
    ? `
    <section class="section reviews" aria-label="Reviews">
      <h2>What guests say</h2>
      <div class="reviews-grid">
        ${config.reviews
          .map(
            (r) => `
        <figure class="review">
          <div class="stars" aria-label="${r.rating} out of 5">${star(r.rating)}</div>
          <blockquote>${esc(r.quote)}</blockquote>
          <figcaption>— ${esc(r.author)}</figcaption>
        </figure>`,
          )
          .join('')}
      </div>
    </section>`
    : '';

  const contact = sections.contact
    ? `
    <section class="section contact" aria-label="Contact">
      <h2>Visit us</h2>
      <p>${esc(config.contact)}</p>
      <a class="btn btn-outline" href="#">${esc(config.heroCta)}</a>
    </section>`
    : '';

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(config.brandName)}</title>
<style>
  :root {
    --bg: ${palette.bg};
    --surface: ${palette.surface};
    --text: ${palette.text};
    --muted: ${palette.muted};
    --accent: ${accent};
    --accent-text: ${palette.accentText};
    --heading: ${fonts.heading};
    --body: ${fonts.body};
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; }
  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--body);
    line-height: 1.55;
    -webkit-font-smoothing: antialiased;
  }
  h1, h2 { font-family: var(--heading); line-height: 1.1; margin: 0 0 0.5em; }
  h1 { font-size: clamp(2rem, 6vw, 3.25rem); }
  h2 { font-size: clamp(1.3rem, 3.5vw, 1.85rem); }
  p { margin: 0 0 1em; }
  a { color: inherit; }
  .hero {
    background:
      radial-gradient(120% 120% at 50% -20%, color-mix(in srgb, var(--accent) 22%, var(--surface)) 0%, var(--surface) 60%);
    padding: clamp(3rem, 9vw, 6rem) 1.5rem;
    text-align: center;
    border-bottom: 1px solid color-mix(in srgb, var(--text) 8%, transparent);
  }
  .hero-inner { max-width: 720px; margin: 0 auto; }
  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-size: 0.72rem;
    color: var(--muted);
    margin-bottom: 0.75rem;
  }
  .btn {
    display: inline-block;
    background: var(--accent);
    color: var(--accent-text);
    text-decoration: none;
    font-weight: 600;
    padding: 0.7rem 1.4rem;
    border-radius: 999px;
    margin-top: 1.25rem;
    border: 1px solid var(--accent);
  }
  .btn-outline {
    background: transparent;
    color: var(--accent);
  }
  .section {
    max-width: 760px;
    margin: 0 auto;
    padding: clamp(2rem, 6vw, 3.5rem) 1.5rem;
  }
  .about p, .contact p { color: var(--muted); max-width: 60ch; }
  .menu-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 1.1rem; }
  .menu-line { display: flex; align-items: baseline; gap: 0.5rem; font-weight: 600; }
  .menu-dots { flex: 1; border-bottom: 1px dotted color-mix(in srgb, var(--text) 30%, transparent); transform: translateY(-3px); }
  .menu-price { color: var(--accent); }
  .menu-desc { color: var(--muted); margin: 0.2rem 0 0; font-size: 0.92rem; }
  .hours-table { width: 100%; border-collapse: collapse; }
  .hours-table th, .hours-table td { text-align: left; padding: 0.55rem 0; border-bottom: 1px solid color-mix(in srgb, var(--text) 8%, transparent); }
  .hours-table th { font-weight: 600; }
  .hours-table td { text-align: right; color: var(--muted); }
  .gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.6rem; }
  .tile {
    aspect-ratio: 1 / 1;
    border-radius: 10px;
    background:
      linear-gradient(135deg, color-mix(in srgb, var(--accent) 30%, var(--surface)), color-mix(in srgb, var(--text) 10%, var(--surface)));
  }
  .reviews-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
  .review {
    margin: 0;
    background: var(--surface);
    border: 1px solid color-mix(in srgb, var(--text) 10%, transparent);
    border-radius: 12px;
    padding: 1.1rem 1.25rem;
  }
  .review blockquote { margin: 0.4rem 0; font-style: italic; }
  .review figcaption { color: var(--muted); font-size: 0.85rem; }
  .stars { color: var(--accent); letter-spacing: 0.1em; }
  .contact { text-align: center; }
  footer {
    text-align: center;
    padding: 2rem 1.5rem;
    color: var(--muted);
    font-size: 0.82rem;
    border-top: 1px solid color-mix(in srgb, var(--text) 8%, transparent);
  }
  @media (max-width: 540px) {
    .reviews-grid { grid-template-columns: 1fr; }
    .gallery-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (prefers-reduced-motion: reduce) {
    * { scroll-behavior: auto; }
  }
</style>
</head>
<body>
  ${hero}
  <main>
    ${about}
    ${menu}
    ${hours}
    ${gallery}
    ${reviews}
    ${contact}
  </main>
  <footer>© ${new Date().getFullYear()} ${esc(config.brandName)} · Built with ClientPulse</footer>
</body>
</html>`;
}
