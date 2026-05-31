'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchJSON } from '@/lib/api/client';
import type { SettingsData } from '@/types/settings';

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => fetchJSON<SettingsData>('/settings'),
  });
}
