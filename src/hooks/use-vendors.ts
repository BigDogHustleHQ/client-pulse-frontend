'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchJSON } from '@/lib/api/client';
import type { VendorsData } from '@/types/vendors';

export function useVendors() {
  return useQuery({
    queryKey: ['vendors'],
    queryFn: () => fetchJSON<VendorsData>('/vendors'),
  });
}
