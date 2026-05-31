'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchJSON } from '@/lib/api/client';
import type { SocialData } from '@/types/social';

export function useSocial() {
  return useQuery({
    queryKey: ['social'],
    queryFn: () => fetchJSON<SocialData>('/social'),
  });
}
