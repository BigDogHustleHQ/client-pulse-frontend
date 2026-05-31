'use client';

import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { isSessionAuthorized, clearSessionMarkers } from '@/lib/clerk/session';

export default function SessionGuard() {
  const { isSignedIn, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn) return;

    if (!isSessionAuthorized()) {
      clearSessionMarkers();
      signOut().then(() => router.replace('/login'));
    }
  }, [isSignedIn, signOut, router]);

  return null;
}
