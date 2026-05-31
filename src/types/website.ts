export type WebsiteMode = 'ai' | 'templates' | 'build';

export type WebsiteModeTab = {
  id: WebsiteMode;
  label: string;
};

/** A single answerable question in the 5-step wizard. */
export type WebsiteQuestion =
  | {
      id: string;
      kind: 'text';
      prompt: string;
      /** Pre-filled answer the mock supplies. */
      answer?: string;
      placeholder?: string;
      done?: boolean;
    }
  | {
      id: string;
      kind: 'chips';
      prompt: string;
      /** Selectable vibe options. */
      options: string[];
      /** Ids/labels currently selected. */
      selected?: string[];
      done?: boolean;
    };

export type WebsiteWizard = {
  /** Total questions in the wizard (e.g. 5). */
  total: number;
  /** How many are answered so far (e.g. 4). */
  completed: number;
  questions: WebsiteQuestion[];
};

/** Section ids that can be toggled on/off in the live preview. */
export type WebsiteSectionId =
  | 'hero'
  | 'about'
  | 'menu'
  | 'hours'
  | 'gallery'
  | 'reviews'
  | 'contact';

/** A named, selectable color palette used by the rendered preview. */
export type WebsitePalette = {
  id: string;
  label: string;
  /** Page background. */
  bg: string;
  /** Primary surface / card background. */
  surface: string;
  /** Body text color. */
  text: string;
  /** Muted/secondary text color. */
  muted: string;
  /** Brand accent (buttons, highlights). */
  accent: string;
  /** Text drawn on top of the accent color. */
  accentText: string;
};

/** A heading/body font pairing applied to the rendered preview. */
export type WebsiteFontPair = {
  id: string;
  label: string;
  /** CSS font-family stack for headings. */
  heading: string;
  /** CSS font-family stack for body copy. */
  body: string;
};

/** A single menu line item rendered in the preview's menu section. */
export type WebsiteMenuItem = {
  name: string;
  description: string;
  price: string;
};

/** A weekday/hours row rendered in the preview's hours section. */
export type WebsiteHoursRow = {
  day: string;
  hours: string;
};

/** A short review/testimonial rendered in the preview. */
export type WebsiteReview = {
  quote: string;
  author: string;
  rating: number;
};

/**
 * The full, editable configuration that drives the live rendered preview.
 * Everything here flows into the generated HTML+CSS string for the iframe.
 */
export type WebsiteConfig = {
  brandName: string;
  tagline: string;
  /** Hero call-to-action button label. */
  heroCta: string;
  aboutText: string;
  paletteId: string;
  /** Overrides the palette accent when set (hex). */
  accentColor: string;
  fontPairId: string;
  /** Which sections are currently visible. */
  sections: Record<WebsiteSectionId, boolean>;
  menu: WebsiteMenuItem[];
  hours: WebsiteHoursRow[];
  reviews: WebsiteReview[];
  /** Number of gallery placeholder tiles to render. */
  galleryCount: number;
  /** Free-form address/phone line for the contact/footer. */
  contact: string;
};

/** One previewable, generated site variation — now a real applyable preset. */
export type WebsiteVariation = {
  id: string;
  /** A/B/C style label. */
  label: string;
  /** Brand name as rendered in the hero. */
  brandName: string;
  /** Short tagline under the hero. */
  tagline: string;
  /** Style descriptor (e.g. "Cozy serif"). */
  style: string;
  /** Labels for the menu/section blocks shown in the thumbnail. */
  menuItems: string[];
  /** Call-to-action button labels in the thumbnail. */
  ctas: string[];
  /** Marks the recommended variation. */
  recommended?: boolean;
  /**
   * Partial config this variation applies to the live preview when picked.
   * Merged over the current config so unspecified fields are preserved.
   */
  preset: Partial<WebsiteConfig>;
};

export type WebsiteData = {
  modes: WebsiteModeTab[];
  activeMode: WebsiteMode;
  wizard: WebsiteWizard;
  variations: WebsiteVariation[];
  /** Available color palettes for the controls panel. */
  palettes: WebsitePalette[];
  /** Available font pairings for the controls panel. */
  fontPairs: WebsiteFontPair[];
  /** Starting config for the live preview. */
  config: WebsiteConfig;
  /** Subdomain the chosen site publishes to, e.g. "bella". */
  publishSubdomain: string;
  /** Root domain, e.g. "vendrr.app". */
  publishDomain: string;
};
