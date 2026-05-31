import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { gqlFetch } from '@/lib/api/client';
import { GET_CURRENT_USER, type GetCurrentUserResponse } from '@/lib/api/queries';

export function useCurrentUser() {
  const { getToken, isSignedIn } = useAuth();

  return useQuery<GetCurrentUserResponse>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const token = await getToken();
      return gqlFetch<GetCurrentUserResponse>(GET_CURRENT_USER, token);
    },
    enabled: !!isSignedIn,
  });
}
