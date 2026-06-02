import SessionGuard from '@/components/SessionGuard';
import UserSync from '@/components/UserSync';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SessionGuard />
      <UserSync />
      {children}
    </>
  );
};

export default DashboardLayout;
