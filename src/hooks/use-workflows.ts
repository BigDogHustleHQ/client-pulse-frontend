'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchJSON } from '@/lib/api/client';
import type { WorkflowsData } from '@/types/workflows';

export function useWorkflows() {
  return useQuery({
    queryKey: ['workflows'],
    queryFn: () => fetchJSON<WorkflowsData>('/workflows'),
  });
}
