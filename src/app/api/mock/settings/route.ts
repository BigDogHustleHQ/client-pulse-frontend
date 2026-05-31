// ⚠️ MOCK ENDPOINT — GET /api/mock/settings
// The mock data for the Settings page lives here and ONLY here. The page and
// its hook consume this shape and react to it; swap this body for a real
// backend and nothing downstream changes. Route handlers are uncached by
// default, so each request re-runs this handler.
import type { MockEnvelope } from '@/lib/api/client';
import type { SettingsData } from '@/types/settings';

export async function GET() {
  const data: SettingsData = {
    integrations: [
      {
        id: 'google',
        name: 'Google Business',
        description: 'Reviews, hours, and Maps presence.',
        connected: true,
        icon: 'Globe',
      },
      {
        id: 'instagram',
        name: 'Instagram',
        description: 'Schedule posts and read DMs.',
        connected: true,
        icon: 'Instagram',
      },
      {
        id: 'opentable',
        name: 'OpenTable',
        description: 'Sync reservations and covers.',
        connected: false,
        icon: 'CalendarClock',
      },
      {
        id: 'square',
        name: 'Square',
        description: 'Pull sales and payment data.',
        connected: true,
        icon: 'CreditCard',
      },
      {
        id: 'mailchimp',
        name: 'Mailchimp',
        description: 'Email campaigns and lists.',
        connected: false,
        icon: 'Mail',
      },
      {
        id: 'yelp',
        name: 'Yelp',
        description: 'Monitor and reply to reviews.',
        connected: false,
        icon: 'Star',
      },
    ],
    brand: {
      name: 'Maria’s Trattoria',
      voice: 'Warm, neighborly, a little playful',
      typography: 'Plus Jakarta Sans',
      palette: ['#b91c1c', '#f59e0b', '#0f766e', '#1e293b'],
      tone: 62,
    },
    budget: {
      selectedTierId: 'business',
      tiers: [
        { id: 'starter', label: 'Starter', priceCap: 25 },
        { id: 'pro', label: 'Pro', priceCap: 50 },
        { id: 'business', label: 'Business', priceCap: 100 },
        { id: 'enterprise', label: 'Enterprise', priceCap: 250 },
      ],
      spend: 64,
      budget: 100,
    },
    team: [
      {
        id: 'maria',
        name: 'Maria Russo',
        email: 'maria@trattoria.co',
        role: 'Owner',
      },
      {
        id: 'sam',
        name: 'Sam Pérez',
        email: 'sam@trattoria.co',
        role: 'Admin',
      },
      {
        id: 'lee',
        name: 'Lee Okafor',
        email: 'lee@trattoria.co',
        role: 'Member',
      },
    ],
    notifications: [
      {
        id: 'reviews',
        label: 'New reviews',
        description: 'Alert me when a customer leaves a review.',
        enabled: true,
      },
      {
        id: 'dms',
        label: 'Direct messages',
        description: 'Notify on incoming social DMs.',
        enabled: true,
      },
      {
        id: 'budget',
        label: 'Budget thresholds',
        description: 'Warn me at 80% of monthly AI spend.',
        enabled: true,
      },
      {
        id: 'digest',
        label: 'Weekly digest',
        description: 'A Monday summary of last week.',
        enabled: false,
      },
    ],
  };

  const body: MockEnvelope<SettingsData> = {
    mock: true,
    generatedAt: new Date().toISOString(),
    data,
  };
  return Response.json(body);
}
