import UserSync from '@/components/UserSync';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UserSync />
      {children}
    </>
  );
}
