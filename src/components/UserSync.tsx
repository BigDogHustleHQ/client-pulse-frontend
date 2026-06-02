'use client';

import { useEffect } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAuthStore } from '@/store';

const UserSync = () => {
  const { data } = useCurrentUser();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    if (data?.getCurrentUser) {
      const { id, email, firstName, lastName } = data.getCurrentUser;
      setUser({ clerkId: id, email, firstName, lastName });
    }
  }, [data, setUser]);

  return null;
};

export default UserSync;
