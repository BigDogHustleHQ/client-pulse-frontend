export type ReservationsKpi = {
  id: string;
  label: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  positiveIsGood?: boolean;
};

/** A single stage in the booking conversion funnel. */
export type ReservationsFunnelStage = { label: string; value: number };

/** Channel attribution slice for the donut. */
export type ReservationsChannel = {
  label: string;
  value: number;
  color?: string;
};

export type WaitlistStatus = 'held' | 'sent' | 'seated' | 'expired';

export type WaitlistEntry = {
  id: string;
  party: string;
  size: number;
  quoted: string;
  status: WaitlistStatus;
  statusLabel: string;
};

/** A repeat-booking cohort row (30/60/90-day retention). */
export type ReservationsCohort = {
  label: string;
  size: number;
  /** Retention percentages per period (D30/D60/D90). Trailing entries may be missing. */
  retention: (number | null)[];
};

export type ReservationsData = {
  title: string;
  narrative: string;
  kpis: ReservationsKpi[];
  funnel: {
    stages: ReservationsFunnelStage[];
    /** Index of the stage whose drop from the previous step is the biggest leak. */
    biggestLeakStage: number;
  };
  channels: ReservationsChannel[];
  waitlist: WaitlistEntry[];
  cohorts: ReservationsCohort[];
};
