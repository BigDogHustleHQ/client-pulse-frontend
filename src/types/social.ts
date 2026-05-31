export type SocialPlatform = 'instagram' | 'facebook' | 'tiktok';

export type SocialSlot = 'morning' | 'afternoon' | 'evening';

export type SocialDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

/** A scheduled post card that lives in one calendar cell. */
export type SocialPost = {
  id: string;
  platform: SocialPlatform;
  /** Short copy shown on the card. */
  caption: string;
  /** Day column the post is seeded into. */
  day: SocialDay;
  /** Time-of-day row the post is seeded into. */
  slot: SocialSlot;
  /** Optional workflow this post is attached to (renders a Badge). */
  workflow?: string;
};

/** A platform in the posting priority rail. */
export type SocialRailItem = {
  id: string;
  platform: SocialPlatform;
  label: string;
};

/** One AI-generated rewrite variation for the selected post. */
export type SocialVariation = {
  id: string;
  /** Short label, e.g. "Playful". */
  tone: string;
  text: string;
};

export type SocialData = {
  /** Human-readable label for the active week, e.g. "Week of Jun 2". */
  weekOf: string;
  posts: SocialPost[];
  rail: SocialRailItem[];
  /** Variations the mock AI returns for the selected-post editor. */
  variations: SocialVariation[];
  /** Tokens the mock AI streams when "make this more playful" runs. */
  aiTokens: string[];
};
