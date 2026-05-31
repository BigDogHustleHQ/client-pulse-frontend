// ⚠️ MOCK ENDPOINT — GET /api/mock/insights
// The mock data for the Insights page lives here and ONLY here. The page and
// its hook consume this shape and react to it; swap this body for a real
// backend and nothing downstream changes. Route handlers are uncached by
// default, so each request re-runs this handler.
import type { MockEnvelope } from '@/lib/api/client';
import type { InsightsData } from '@/types/insights';

export async function GET() {
  const data: InsightsData = {
    period: 'Last 30 days',
    summary: {
      model: 'Opus 4.7',
      narrative:
        'Revenue is up 11% MoM, driven by dinner covers. Your no-show rate beats the local median. Watch lunch traffic — down 6% and trailing two nearby competitors.',
      highlights: [
        { id: 's1', label: 'Dinner covers +11%', kind: 'strength' },
        { id: 's2', label: 'No-shows beat median', kind: 'strength' },
        { id: 's3', label: 'Strong repeat rate', kind: 'strength' },
        { id: 'r1', label: 'Lunch traffic -6%', kind: 'risk' },
        { id: 'r2', label: 'Trailing on pasta price', kind: 'risk' },
      ],
    },
    growth: {
      trend: [180, 196, 188, 210, 205, 230, 224, 248, 260, 255, 278, 312],
      newCustomers: 312,
      repeatRate: '58%',
      ltvValue: '$214',
      ltvDelta: 9,
    },
    pricing: [
      { id: 'burrata', item: 'Burrata', you: '$14', market: '$16', delta: -12 },
      { id: 'pasta', item: 'Pasta', you: '$22', market: '$20', delta: 10 },
      { id: 'wine', item: 'Wine glass', you: '$11', market: '$13', delta: -15 },
      { id: 'tiramisu', item: 'Tiramisu', you: '$9', market: '$9', delta: 0 },
    ],
    prosCons: [
      { id: 'p1', label: 'Strong repeat rate', kind: 'pro' },
      { id: 'p2', label: 'High review score', kind: 'pro' },
      { id: 'c1', label: 'Lunch underperforming', kind: 'con' },
      { id: 'c2', label: 'Slow Friday service', kind: 'con' },
    ],
    dropOff: {
      stages: [
        { label: 'Site visit', value: 4200 },
        { label: 'Menu view', value: 2680 },
        { label: 'Book started', value: 910 },
        { label: 'Confirmed', value: 742 },
      ],
      leakAt: 'Menu → Book',
    },
    recommendations: [
      {
        id: 'rec1',
        text: 'Launch a weekday lunch promo to recover the 6% midday dip.',
        actionLabel: 'Create workflow',
      },
      {
        id: 'rec2',
        text: 'Nudge 86 lapsed regulars with a personalized comeback offer.',
        actionLabel: 'Draft campaign',
      },
      {
        id: 'rec3',
        text: 'Revisit pasta pricing — you sit 10% above the local market.',
        actionLabel: 'Review pricing',
      },
    ],
  };

  const body: MockEnvelope<InsightsData> = {
    mock: true,
    generatedAt: new Date().toISOString(),
    data,
  };
  return Response.json(body);
}
