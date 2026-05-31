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

/** One previewable, generated site variation. */
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
  /** Labels for the menu/section blocks shown in the preview. */
  menuItems: string[];
  /** Call-to-action button labels in the preview. */
  ctas: string[];
  /** Marks the recommended variation. */
  recommended?: boolean;
};

export type WebsiteData = {
  modes: WebsiteModeTab[];
  activeMode: WebsiteMode;
  wizard: WebsiteWizard;
  variations: WebsiteVariation[];
  /** Subdomain the chosen site publishes to, e.g. "bella". */
  publishSubdomain: string;
  /** Root domain, e.g. "vendrr.app". */
  publishDomain: string;
};
