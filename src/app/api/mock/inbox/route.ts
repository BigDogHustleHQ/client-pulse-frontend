// ⚠️ MOCK ENDPOINT — GET /api/mock/inbox
// The mock data for the Inbox page lives here and ONLY here. The page and its
// hook consume this shape and react to it; swap this body for a real backend
// and nothing downstream changes. Route handlers are uncached by default, so
// each request re-runs this handler.
import type { MockEnvelope } from '@/lib/api/client';
import type { InboxChannel, InboxData } from '@/types/inbox';

// Each channel carries its own deterministic representative message + AI reply
// (with a 0..1 confidence). The Thread renders whichever channel is selected,
// so these values are the contract the e2e suite pins against.
const channels: InboxChannel[] = [
  {
    id: 'all',
    label: 'All',
    count: 42,
    tone: 'Mixed',
    autoSend: false,
    message: {
      id: 'msg-all',
      channelId: 'all',
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
  },
  {
    id: 'google',
    label: 'Google',
    count: 12,
    tone: 'Professional',
    autoSend: true,
    message: {
      id: 'msg-google',
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
  },
  {
    id: 'yelp',
    label: 'Yelp',
    count: 5,
    tone: 'Professional',
    autoSend: true,
    message: {
      id: 'msg-yelp',
      channelId: 'yelp',
      source: 'Yelp review',
      sourceTone: 'primary',
      sender: 'Priya N.',
      rating: 5,
      body: 'Hands down the best brunch in the neighborhood. The shakshuka is a must — we drove 40 minutes just for it and would do it again.',
      receivedAt: '5h ago',
    },
    reply: {
      prompt:
        'Draft a grateful reply to a glowing 5-star Yelp review praising the shakshuka.',
      draft:
        "Priya, this made our whole kitchen smile — thank you! The shakshuka is the chef's pride, so we're thrilled it was worth the drive. Brunch is on us next time you're in.",
      confidence: 0.94,
    },
  },
  {
    id: 'ig',
    label: 'IG DMs',
    count: 9,
    tone: 'Friendly',
    autoSend: false,
    message: {
      id: 'msg-ig',
      channelId: 'ig',
      source: 'Instagram DM',
      sourceTone: 'brand',
      sender: '@maya.eats',
      body: 'hi! do you take walk-ins for groups of 6 on a saturday night or should we book ahead? 🙏',
      receivedAt: '20m ago',
    },
    reply: {
      prompt:
        'Draft a friendly Instagram DM reply about Saturday walk-ins for a group of six.',
      draft:
        "Hey Maya! Saturdays get busy fast, so we'd recommend booking ahead for a party of 6 — but DM us a time and we'll do our best to squeeze you in. Can't wait to host you!",
      confidence: 0.71,
    },
  },
  {
    id: 'sms',
    label: 'SMS',
    count: 11,
    tone: 'Casual',
    autoSend: false,
    message: {
      id: 'msg-sms',
      channelId: 'sms',
      source: 'SMS',
      sourceTone: 'neutral',
      sender: '+1 (415) 555-0142',
      body: 'Running 10 min late for my 7pm res under Dani — will you still hold the table?',
      receivedAt: '4m ago',
    },
    reply: {
      prompt:
        'Draft a quick, casual SMS reply reassuring a guest running ten minutes late.',
      draft:
        "No worries, Dani — we've got your 7pm held. Drive safe and we'll see you in a few!",
      confidence: 0.88,
    },
  },
  {
    id: 'email',
    label: 'Email',
    count: 5,
    tone: 'Professional',
    autoSend: true,
    message: {
      id: 'msg-email',
      channelId: 'email',
      source: 'Email',
      sourceTone: 'info',
      sender: 'events@harborllc.com',
      body: 'We are planning a 30-person holiday dinner in December and would like to inquire about private dining options and a prix-fixe menu.',
      receivedAt: '1d ago',
    },
    reply: {
      prompt:
        'Draft a professional email reply about private dining and a prix-fixe menu for a 30-person holiday party.',
      draft:
        'Thank you for thinking of us for your holiday dinner. We would be delighted to host your party of 30 in our private dining room and can tailor a prix-fixe menu to your budget. I have attached our event packet — would a call this week work to finalize details?',
      confidence: 0.83,
    },
  },
];

const selectedChannelId: InboxData['selectedChannelId'] = 'google';
const defaultChannel =
  channels.find((c) => c.id === selectedChannelId) ?? channels[0];

export async function GET() {
  const data: InboxData = {
    channels,
    selectedChannelId,
    // Mirror the default channel so consumers reading the top-level shape keep
    // working even before they switch to the per-channel data.
    selectedMessage: defaultChannel.message,
    reply: defaultChannel.reply,
    threshold: 0.8,
  };

  const body: MockEnvelope<InboxData> = {
    mock: true,
    generatedAt: new Date().toISOString(),
    data,
  };
  return Response.json(body);
}
