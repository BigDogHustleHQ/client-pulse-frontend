// ⚠️ MOCK ENDPOINT — GET /api/mock/reservations
// The mock data for the Reservations page lives here and ONLY here. The page
// and its hook consume this shape and react to it; swap this body for a real
// backend and nothing downstream changes. Route handlers are uncached by
// default, so each request re-runs this handler.
import type { MockEnvelope } from '@/lib/api/client';
import type { ReservationsData } from '@/types/reservations';

export async function GET() {
  const data: ReservationsData = {
    title: 'Reservations',
    narrative:
      '86 covers booked tonight with 23 open slots. Your booking widget is leaking hard at the Started→Confirmed step — a third of started bookings never finish. 4 parties are on the waitlist; auto-fill could seat them now.',
    kpis: [
      {
        id: 'booked',
        label: 'Booked',
        value: '86',
        delta: 9,
        deltaLabel: 'vs last Sat',
      },
      {
        id: 'walkins',
        label: 'Walk-ins',
        value: '14',
        delta: 4,
        deltaLabel: 'vs last Sat',
      },
      {
        id: 'noshow',
        label: 'No-show risk',
        value: '5',
        delta: -2,
        deltaLabel: 'flagged',
        positiveIsGood: false,
      },
      {
        id: 'open',
        label: 'Open slots',
        value: '23',
        delta: -6,
        deltaLabel: 'tonight',
      },
    ],
    funnel: {
      stages: [
        { label: 'Widget views', value: 4820 },
        { label: 'Started booking', value: 980 },
        { label: 'Confirmed', value: 412 },
      ],
      biggestLeakStage: 2,
    },
    channels: [
      { label: 'Widget', value: 46 },
      { label: 'Google', value: 31 },
      { label: 'Phone', value: 23 },
    ],
    waitlist: [
      {
        id: 'w1',
        party: 'Lee',
        size: 4,
        quoted: '7:30',
        status: 'held',
        statusLabel: 'Held',
      },
      {
        id: 'w2',
        party: 'Ng',
        size: 2,
        quoted: '8:00',
        status: 'sent',
        statusLabel: 'Sent',
      },
      {
        id: 'w3',
        party: 'Patel',
        size: 6,
        quoted: '8:15',
        status: 'held',
        statusLabel: 'Held',
      },
      {
        id: 'w4',
        party: 'Diaz',
        size: 3,
        quoted: '8:45',
        status: 'seated',
        statusLabel: 'Seated',
      },
    ],
    cohorts: [
      { label: 'Jan', size: 312, retention: [62, 41, 28] },
      { label: 'Feb', size: 298, retention: [58, 34, null] },
      { label: 'Mar', size: 341, retention: [55, null, null] },
    ],
  };

  const body: MockEnvelope<ReservationsData> = {
    mock: true,
    generatedAt: new Date().toISOString(),
    data,
  };
  return Response.json(body);
}
