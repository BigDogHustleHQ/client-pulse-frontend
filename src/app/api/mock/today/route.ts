// ⚠️ MOCK ENDPOINT — GET /api/mock/today
// The mock data for the Today page lives here and ONLY here. The page and its
// hook consume this shape and react to it; swap this body for a real backend
// and nothing downstream changes. Route handlers are uncached by default, so
// each request re-runs this handler.
import type { MockEnvelope } from '@/lib/api/client';
import type { TodayData } from '@/types/today';

export async function GET() {
  const data: TodayData = {
    greeting: 'Good morning, Maria',
    narrative:
      "You're tracking 8% ahead of last Tuesday. Dinner is nearly full; lunch has 12 open slots — consider a midday promo. 2 reviews and 3 DMs are awaiting reply.",
    kpis: [
      {
        id: 'covers',
        label: 'Covers today',
        value: '142',
        delta: 12,
        deltaLabel: 'vs last Tue',
      },
      {
        id: 'revenue',
        label: 'Revenue',
        value: '$4,820',
        delta: 8,
        deltaLabel: 'vs last Tue',
      },
      {
        id: 'reviews',
        label: 'New reviews',
        value: '12',
        delta: 3,
        deltaLabel: 'this week',
      },
      {
        id: 'noshow',
        label: 'No-show rate',
        value: '3%',
        delta: -2,
        positiveIsGood: false,
      },
    ],
    shortcuts: [
      { id: 'post', label: '+ New post' },
      { id: 'reservation', label: '+ Reservation' },
      { id: 'ask', label: 'Ask AI' },
      { id: 'site', label: 'Generate site' },
    ],
    aiActions: [
      {
        id: 'review-1',
        title: 'Reply to a 4★ Google review',
        prompt:
          'Draft a warm thank-you reply to a 4-star review mentioning slow Friday service.',
        draft:
          "Hi Jordan, thanks for the kind words — sorry about Friday's wait. We've added weekend staff so your next visit is smoother. Hope to see you soon!",
        confidence: 0.94,
      },
      {
        id: 'promo-1',
        title: 'Slow Tuesday — promo draft',
        prompt:
          'Draft a short social post promoting a Tuesday midday lunch special.',
        draft:
          'Beat the Tuesday slump 🍝 Two-course lunch for $18, 11:30–2. Walk in or book online — we saved you a table.',
        confidence: 0.71,
      },
    ],
    goals: [
      { id: 'covers-goal', label: 'Hit 150 covers', value: 142, target: 150 },
      { id: 'dms', label: 'Reply to all DMs', value: 3, target: 8 },
      { id: 'posts', label: 'Post 3x this week', value: 2, target: 3 },
    ],
  };

  const body: MockEnvelope<TodayData> = {
    mock: true,
    generatedAt: new Date().toISOString(),
    data,
  };
  return Response.json(body);
}
