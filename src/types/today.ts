export type TodayKpi = {
  id: string;
  label: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  positiveIsGood?: boolean;
};

export type TodayShortcut = { id: string; label: string };

export type TodayAiAction = {
  id: string;
  title: string;
  /** Prompt handed to the (mock) AI to produce the draft. */
  prompt: string;
  /** The drafted reply text the endpoint supplies. */
  draft: string;
  /** 0..1 confidence score. */
  confidence: number;
};

export type TodayGoal = {
  id: string;
  label: string;
  value: number;
  target: number;
};

export type TodayData = {
  greeting: string;
  narrative: string;
  kpis: TodayKpi[];
  shortcuts: TodayShortcut[];
  aiActions: TodayAiAction[];
  goals: TodayGoal[];
};
