// ⚠️ MOCK ENDPOINT — GET /api/mock/social
// The mock data for the Social Studio page lives here and ONLY here. The page
// and its hook consume this shape and react to it; swap this body for a real
// backend and nothing downstream changes. Route handlers are uncached by
// default, so each request re-runs this handler.
import type { MockEnvelope } from '@/lib/api/client';
import type { SocialData } from '@/types/social';

export async function GET() {
  const data: SocialData = {
    weekOf: 'Week of Jun 2',
    posts: [
      {
        id: 'p1',
        platform: 'instagram',
        caption: 'Sunrise patio is open ☀️ First coffees on the house, 7–8.',
        day: 'mon',
        slot: 'morning',
      },
      {
        id: 'p2',
        platform: 'facebook',
        caption: 'Midweek menu drop — new spring pasta. Book your table.',
        day: 'tue',
        slot: 'morning',
      },
      {
        id: 'p3',
        platform: 'instagram',
        caption: 'Behind the pass: plating tonight’s special.',
        day: 'thu',
        slot: 'morning',
      },
      {
        id: 'p4',
        platform: 'tiktok',
        caption: 'POV: the cheese pull no one was ready for 🧀',
        day: 'mon',
        slot: 'afternoon',
        workflow: 'Reel auto-publish',
      },
      {
        id: 'p5',
        platform: 'instagram',
        caption: 'Happy hour starts at 4. Tell a friend.',
        day: 'wed',
        slot: 'afternoon',
      },
      {
        id: 'p6',
        platform: 'facebook',
        caption: 'We’re hiring weekend servers — apply in bio.',
        day: 'thu',
        slot: 'afternoon',
      },
      {
        id: 'p7',
        platform: 'instagram',
        caption: 'Date-night tables still open. Candles lit. 🍷',
        day: 'mon',
        slot: 'evening',
      },
      {
        id: 'p8',
        platform: 'instagram',
        caption: 'Tonight’s dessert: brown-butter tart. Limited.',
        day: 'tue',
        slot: 'evening',
      },
      {
        id: 'p9',
        platform: 'facebook',
        caption: 'Live music Friday — reserve early, it fills fast.',
        day: 'wed',
        slot: 'evening',
        workflow: 'Event promo',
      },
      {
        id: 'p10',
        platform: 'tiktok',
        caption: 'Closing-time clean-up set to a beat 🎶',
        day: 'fri',
        slot: 'evening',
      },
    ],
    rail: [
      { id: 'r1', platform: 'instagram', label: 'Instagram' },
      { id: 'r2', platform: 'facebook', label: 'Facebook' },
      { id: 'r3', platform: 'tiktok', label: 'TikTok' },
    ],
    variations: [
      {
        id: 'v1',
        tone: 'Playful',
        text: 'Plot twist: your Tuesday just got tastier 🍝 New spring pasta is here — grab a table before it sells out!',
      },
      {
        id: 'v2',
        tone: 'Warm',
        text: 'Spring’s on the menu. Our new pasta is made to share — we saved you a seat whenever you’re ready.',
      },
      {
        id: 'v3',
        tone: 'Punchy',
        text: 'New spring pasta. Tonight only-level good. Book now.',
      },
    ],
    aiTokens: [
      'Plot ',
      'twist: ',
      'your ',
      'Tuesday ',
      'just ',
      'got ',
      'tastier ',
      '🍝 ',
      'New ',
      'spring ',
      'pasta ',
      'is ',
      'here!',
    ],
  };

  const body: MockEnvelope<SocialData> = {
    mock: true,
    generatedAt: new Date().toISOString(),
    data,
  };
  return Response.json(body);
}
