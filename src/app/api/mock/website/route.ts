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
    variations: [
      {
        id: 'var-a',
        label: 'A',
        brandName: "Bella's",
        tagline: 'Wood-fired since 1998',
        style: 'Warm serif · centered hero',
        menuItems: ['Antipasti', 'Pizza', 'Pasta', 'Dolci'],
        ctas: ['Book', 'Map'],
        recommended: true,
      },
      {
        id: 'var-b',
        label: 'B',
        brandName: "BELLA'S",
        tagline: 'Neighborhood trattoria',
        style: 'Bold display · full-bleed photo',
        menuItems: ['Starters', 'Mains', 'Wine'],
        ctas: ['Reserve'],
      },
      {
        id: 'var-c',
        label: 'C',
        brandName: "bella's",
        tagline: 'Slow food, fast smiles',
        style: 'Minimal sans · split layout',
        menuItems: ['Menu', 'Hours', 'Order'],
        ctas: ['Order'],
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
