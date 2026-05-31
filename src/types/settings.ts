export type IntegrationProvider = {
  id: string;
  name: string;
  /** Short description of what the integration does. */
  description: string;
  /** Whether the account is currently linked. */
  connected: boolean;
  /** lucide-react icon name used as a brand placeholder. */
  icon: string;
};

export type BrandProfile = {
  /** Business display name. */
  name: string;
  /** Voice descriptor (e.g. "warm, concise"). */
  voice: string;
  /** Primary typeface. */
  typography: string;
  /** Ordered palette swatches as CSS color strings. */
  palette: string[];
  /** Tone slider position 0..100 (Formal ↔ Playful). */
  tone: number;
};

export type BudgetTier = {
  id: string;
  label: string;
  /** Monthly AI spend cap in dollars. */
  priceCap: number;
};

export type BudgetData = {
  /** Currently selected tier id. */
  selectedTierId: string;
  tiers: BudgetTier[];
  /** AI spend so far this month, in dollars. */
  spend: number;
  /** This month's budget, in dollars. */
  budget: number;
};

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Member';
};

export type NotificationPref = {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
};

export type SettingsData = {
  integrations: IntegrationProvider[];
  brand: BrandProfile;
  budget: BudgetData;
  team: TeamMember[];
  notifications: NotificationPref[];
};
