// ⚠️ MOCK ENDPOINT — GET /api/mock/website
// The mock data for the Website Builder page lives here and ONLY here. The page
// and its hook consume this shape and react to it; swap this body for a real
// backend and nothing downstream changes. Route handlers are uncached by
// default, so each request re-runs this handler.
import type { MockEnvelope } from '@/lib/api/client';
import type { WebsiteData } from '@/types/website';

export async function GET() {
  const data: WebsiteData = {
    modes: [
      { id: 'ai', label: 'AI-generated' },
      { id: 'templates', label: 'Templates' },
      { id: 'build', label: 'Drag-build' },
    ],
    activeMode: 'ai',
    wizard: {
      total: 5,
      completed: 4,
      questions: [
        {
          id: 'name',
          kind: 'text',
          prompt: 'What is your business name?',
          answer: "Bella's Trattoria",
          done: true,
        },
        {
          id: 'vibe',
          kind: 'chips',
          prompt: 'Pick the vibe that fits you',
          options: ['Cozy', 'Rustic', 'Modern', 'Upscale', 'Playful'],
          selected: ['Cozy', 'Rustic'],
          done: true,
        },
        {
          id: 'dish',
          kind: 'text',
          prompt: 'What is your signature dish?',
          answer: 'Wood-fired Margherita',
          done: true,
        },
        {
          id: 'colors',
          kind: 'chips',
          prompt: 'Choose a color palette',
          options: ['Terracotta', 'Olive', 'Cream', 'Charcoal'],
          selected: ['Terracotta', 'Cream'],
          done: true,
        },
        {
          id: 'cta',
          kind: 'text',
          prompt: 'What should the main call to action be?',
          placeholder: 'e.g. Book a table',
          done: false,
        },
      ],
    },
    palettes: [
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
      {
        id: 'modern',
        label: 'Modern',
        bg: '#0f1115',
        surface: '#181b22',
        text: '#f2f4f8',
        muted: '#9aa3b2',
        accent: '#6d8bff',
        accentText: '#0f1115',
      },
      {
        id: 'coastal',
        label: 'Coastal',
        bg: '#f3f9fb',
        surface: '#ffffff',
        text: '#13313b',
        muted: '#5d7e88',
        accent: '#1f8aa6',
        accentText: '#ffffff',
      },
      {
        id: 'mono',
        label: 'Mono',
        bg: '#fafafa',
        surface: '#ffffff',
        text: '#171717',
        muted: '#737373',
        accent: '#171717',
        accentText: '#ffffff',
      },
    ],
    fontPairs: [
      {
        id: 'classic',
        label: 'Classic serif',
        heading: "'Playfair Display', Georgia, 'Times New Roman', serif",
        body: "Georgia, 'Times New Roman', serif",
      },
      {
        id: 'modern',
        label: 'Modern sans',
        heading:
          "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        body: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      },
      {
        id: 'editorial',
        label: 'Editorial mix',
        heading: "Georgia, 'Times New Roman', serif",
        body: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      },
    ],
    config: {
      brandName: "Bella's Trattoria",
      tagline: 'Wood-fired Italian, made by hand since 1998',
      heroCta: 'Book a table',
      aboutText:
        'A neighborhood trattoria where every pizza is wood-fired and every pasta is rolled fresh each morning. Family-run, generous portions, and a wine list to match.',
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
      menu: [
        {
          name: 'Margherita',
          description: 'San Marzano, fior di latte, basil',
          price: '$16',
        },
        {
          name: 'Tagliatelle al Ragù',
          description: 'Slow-braised beef, hand-cut pasta',
          price: '$22',
        },
        {
          name: 'Burrata & Peach',
          description: 'Stone fruit, basil oil, sea salt',
          price: '$14',
        },
        {
          name: 'Tiramisù',
          description: 'Espresso-soaked savoiardi, mascarpone',
          price: '$10',
        },
      ],
      hours: [
        { day: 'Mon – Thu', hours: '5:00 – 10:00 PM' },
        { day: 'Fri – Sat', hours: '5:00 – 11:00 PM' },
        { day: 'Sunday', hours: '4:00 – 9:00 PM' },
      ],
      reviews: [
        {
          quote: 'The Margherita is the best in the city. Full stop.',
          author: 'Dana R.',
          rating: 5,
        },
        {
          quote: 'Cozy, warm, and the ragù tastes like a Sunday in Bologna.',
          author: 'Marcus T.',
          rating: 5,
        },
      ],
      galleryCount: 6,
      contact: '142 Mulberry St · (212) 555-0198 · hello@bellas.example',
    },
    variations: [
      {
        id: 'var-a',
        label: 'A',
        brandName: "Bella's Trattoria",
        tagline: 'Wood-fired Italian, made by hand since 1998',
        style: 'Warm serif · centered hero',
        menuItems: ['Antipasti', 'Pizza', 'Pasta', 'Dolci'],
        ctas: ['Book', 'Map'],
        recommended: true,
        preset: {
          brandName: "Bella's Trattoria",
          tagline: 'Wood-fired Italian, made by hand since 1998',
          heroCta: 'Book a table',
          paletteId: 'warm',
          accentColor: '#c2562e',
          fontPairId: 'classic',
        },
      },
      {
        id: 'var-b',
        label: 'B',
        brandName: "BELLA'S",
        tagline: 'Neighborhood trattoria, after dark',
        style: 'Bold display · dark + full-bleed',
        menuItems: ['Starters', 'Mains', 'Wine'],
        ctas: ['Reserve'],
        preset: {
          brandName: "BELLA'S",
          tagline: 'Neighborhood trattoria, after dark',
          heroCta: 'Reserve now',
          paletteId: 'modern',
          accentColor: '#6d8bff',
          fontPairId: 'modern',
        },
      },
      {
        id: 'var-c',
        label: 'C',
        brandName: "bella's",
        tagline: 'Slow food, fast smiles',
        style: 'Minimal sans · coastal calm',
        menuItems: ['Menu', 'Hours', 'Order'],
        ctas: ['Order'],
        preset: {
          brandName: "bella's",
          tagline: 'Slow food, fast smiles',
          heroCta: 'Order online',
          paletteId: 'coastal',
          accentColor: '#1f8aa6',
          fontPairId: 'editorial',
        },
      },
    ],
    publishSubdomain: 'bella',
    publishDomain: 'vendrr.app',
  };

  const body: MockEnvelope<WebsiteData> = {
    mock: true,
    generatedAt: new Date().toISOString(),
    data,
  };
  return Response.json(body);
}
