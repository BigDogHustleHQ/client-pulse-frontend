'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchJSON } from '@/lib/api/client';
import type { TodayData } from '@/types/today';

export function useToday() {
  return useQuery({
    queryKey: ['today'],
    queryFn: () => fetchJSON<TodayData>('/today'),
  });
}
