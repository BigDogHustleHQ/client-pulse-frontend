import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

export default function Page(): ReactNode {
  redirect('/login');
}
