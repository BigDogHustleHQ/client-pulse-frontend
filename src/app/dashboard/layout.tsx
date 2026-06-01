import SessionGuard from '@/components/SessionGuard';
import UserSync from '@/components/UserSync';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SessionGuard />
      <UserSync />
      {children}
    </>
  );
}
