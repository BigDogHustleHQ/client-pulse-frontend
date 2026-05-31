'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchJSON } from '@/lib/api/client';
import type { WebsiteData } from '@/types/website';

export function useWebsite() {
  return useQuery({
    queryKey: ['website'],
    queryFn: () => fetchJSON<WebsiteData>('/website'),
  });
}
