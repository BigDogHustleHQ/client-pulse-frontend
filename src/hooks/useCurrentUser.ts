import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { gqlFetch } from '@/lib/api/graphql';
import { GET_CURRENT_USER, type UserResponse } from '@/lib/api/queries';

export function useCurrentUser() {
  const { getToken, isSignedIn } = useAuth();

  return useQuery<UserResponse>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const token = await getToken();
      return gqlFetch<UserResponse>(GET_CURRENT_USER, token);
    },
    enabled: !!isSignedIn,
  });
}
