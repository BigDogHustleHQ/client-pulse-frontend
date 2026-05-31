export type InboxChannelId = 'all' | 'google' | 'yelp' | 'ig' | 'sms' | 'email';

export type InboxChannel = {
  id: InboxChannelId;
  label: string;
  /** Unread/pending message count shown in a <Badge>. */
  count: number;
  /** Default reply tone for the channel, shown as a <Pill>. */
  tone: string;
  /** Whether high-confidence drafts may auto-send on this channel. */
  autoSend: boolean;
};

export type InboxMessage = {
  id: string;
  /** Channel this thread belongs to. */
  channelId: InboxChannelId;
  /** Human source label, e.g. "Google review". */
  source: string;
  /** Pill tone used to color the source tag. */
  sourceTone: 'info' | 'brand' | 'primary' | 'neutral';
  sender: string;
  /** Optional star rating (0..5) for review channels. */
  rating?: number;
  /** The inbound message body. */
  body: string;
  /** Relative time, e.g. "2h ago". */
  receivedAt: string;
};

export type InboxReply = {
  /** Prompt handed to the (mock) AI to produce the draft. */
  prompt: string;
  /** The drafted reply text the endpoint supplies. */
  draft: string;
  /** 0..1 confidence score. */
  confidence: number;
};

export type InboxData = {
  channels: InboxChannel[];
  /** The id of the currently selected channel. */
  selectedChannelId: InboxChannelId;
  /** The message thread currently open. */
  selectedMessage: InboxMessage;
  /** AI-drafted reply for the selected message. */
  reply: InboxReply;
  /** Confidence threshold (0..1) below which an owner must review. */
  threshold: number;
};
