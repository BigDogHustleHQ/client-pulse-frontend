'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchJSON } from '@/lib/api/client';
import type { InsightsData } from '@/types/insights';

export function useInsights() {
  return useQuery({
    queryKey: ['insights'],
    queryFn: () => fetchJSON<InsightsData>('/insights'),
  });
}
