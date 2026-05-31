// Data-access layer. Every page fetches through here.
//
// ⚠️ MOCK PHASE: all data currently comes from in-repo mock route handlers
// under `src/app/api/mock/*`. The mock data lives ONLY in those endpoints —
// pages and hooks never hardcode data, they fetch this shape and react to it.
// To go live, point MOCK_BASE at the real API (e.g. '' for same-origin
// `/api/*`, or an env-driven base) and delete the mock route handlers. No
// page or component code needs to change.
export const MOCK_BASE = '/api/mock';

/** Standard envelope every mock endpoint returns. */
export type MockEnvelope<T> = {
  mock: boolean;
  /** ISO timestamp the mock payload was generated. */
  generatedAt: string;
  data: T;
};

export async function fetchJSON<T>(path: string): Promise<MockEnvelope<T>> {
  const res = await fetch(`${MOCK_BASE}${path}`, {
    headers: { accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`Request to ${path} failed: ${res.status}`);
  }
  return res.json() as Promise<MockEnvelope<T>>;
}
