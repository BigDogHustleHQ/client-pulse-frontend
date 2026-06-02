import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

const Page = (): ReactNode => {
  redirect('/login');
};

export default Page;
