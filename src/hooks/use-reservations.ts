'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchJSON } from '@/lib/api/client';
import type { ReservationsData } from '@/types/reservations';

export function useReservations() {
  return useQuery({
    queryKey: ['reservations'],
    queryFn: () => fetchJSON<ReservationsData>('/reservations'),
  });
}
