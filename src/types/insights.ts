export type InsightsHighlight = {
  id: string;
  label: string;
  /** Pill tone — strengths render success, risks render warning. */
  kind: 'strength' | 'risk';
};

export type InsightsSummary = {
  /** Model that produced the summary, e.g. "Opus 4.7". */
  model: string;
  narrative: string;
  highlights: InsightsHighlight[];
};

export type InsightsGrowth = {
  /** Customer-count trend feeding the sparkline. */
  trend: number[];
  newCustomers: number;
  repeatRate: string;
  ltvValue: string;
  ltvDelta: number;
};

export type InsightsPriceRow = {
  id: string;
  item: string;
  you: string;
  market: string;
  /** Signed percent delta vs market; negative = cheaper than market. */
  delta: number;
};

export type InsightsProCon = {
  id: string;
  label: string;
  kind: 'pro' | 'con';
};

export type InsightsFunnelStage = { label: string; value: number };

export type InsightsDropOff = {
  stages: InsightsFunnelStage[];
  /** Human-readable leak callout, e.g. "Menu → Book". */
  leakAt: string;
};

export type InsightsRecommendation = {
  id: string;
  text: string;
  /** Label for the action button that operationalizes the rec. */
  actionLabel: string;
};

export type InsightsData = {
  period: string;
  summary: InsightsSummary;
  growth: InsightsGrowth;
  pricing: InsightsPriceRow[];
  prosCons: InsightsProCon[];
  dropOff: InsightsDropOff;
  recommendations: InsightsRecommendation[];
};
