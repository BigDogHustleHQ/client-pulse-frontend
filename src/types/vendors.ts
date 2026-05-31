/** The four pipeline stages a vendor moves through. */
export type VendorLaneId = 'leads' | 'contacted' | 'quoted' | 'signed';

export type VendorLane = {
  id: VendorLaneId;
  label: string;
};

/** Per-card lead status tag rendered as a <Pill>. */
export type VendorStatus = 'new' | 'pending' | 'signed';

export type Vendor = {
  id: string;
  /** Lane the vendor currently sits in. */
  lane: VendorLaneId;
  name: string;
  /** 0..5 star rating, optional (some cards only show a price). */
  rating?: number;
  /** Per-unit price string, e.g. "$5.10/lb". */
  price?: string;
  /** Point of contact name. */
  poc?: string;
  /** Lead status tag. */
  status: VendorStatus;
};

/** The cold-email composer surface seeded from the endpoint. */
export type VendorDraft = {
  /** Vendor the draft targets. */
  vendorId: string;
  title: string;
  /** Prompt handed to the (mock) AI. */
  prompt: string;
  /** The drafted cold-email text the endpoint supplies. */
  draft: string;
  /** 0..1 confidence score. */
  confidence: number;
};

export type VendorsData = {
  category: string;
  lanes: VendorLane[];
  vendors: Vendor[];
  coldEmail: VendorDraft;
};
