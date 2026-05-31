'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchJSON } from '@/lib/api/client';
import type { InboxData } from '@/types/inbox';

export function useInbox() {
  return useQuery({
    queryKey: ['inbox'],
    queryFn: () => fetchJSON<InboxData>('/inbox'),
  });
}
