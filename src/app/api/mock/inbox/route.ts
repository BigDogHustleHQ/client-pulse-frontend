// ⚠️ MOCK ENDPOINT — GET /api/mock/inbox
// The mock data for the Inbox page lives here and ONLY here. The page and its
// hook consume this shape and react to it; swap this body for a real backend
// and nothing downstream changes. Route handlers are uncached by default, so
// each request re-runs this handler.
import type { MockEnvelope } from '@/lib/api/client';
import type { InboxData } from '@/types/inbox';

export async function GET() {
  const data: InboxData = {
    channels: [
      { id: 'all', label: 'All', count: 42, tone: 'Mixed', autoSend: false },
      {
        id: 'google',
        label: 'Google',
        count: 12,
        tone: 'Professional',
        autoSend: true,
      },
      {
        id: 'yelp',
        label: 'Yelp',
        count: 5,
        tone: 'Professional',
        autoSend: true,
      },
      {
        id: 'ig',
        label: 'IG DMs',
        count: 9,
        tone: 'Friendly',
        autoSend: false,
      },
      { id: 'sms', label: 'SMS', count: 11, tone: 'Casual', autoSend: false },
      {
        id: 'email',
        label: 'Email',
        count: 5,
        tone: 'Professional',
        autoSend: true,
      },
    ],
    selectedChannelId: 'google',
    selectedMessage: {
      id: 'msg-1',
      channelId: 'google',
      source: 'Google review',
      sourceTone: 'info',
      sender: 'Jordan P.',
      rating: 4,
      body: 'Great food but slow service on Friday. Still, the pasta was incredible and the staff were friendly once we were seated.',
      receivedAt: '2h ago',
    },
    reply: {
      prompt:
        'Draft a warm thank-you reply to a 4-star Google review mentioning slow Friday service.',
      draft:
        "Hi Jordan, thanks for the kind words — sorry about Friday's wait. We've added staff for weekends so your next visit is smoother. Hope to see you again soon!",
      confidence: 0.78,
    },
    threshold: 0.8,
  };

  const body: MockEnvelope<InboxData> = {
    mock: true,
    generatedAt: new Date().toISOString(),
    data,
  };
  return Response.json(body);
}
