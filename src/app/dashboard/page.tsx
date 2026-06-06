'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';

export default function DashboardPage() {
  const { signOut } = useAuth();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <header className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Welcome back{user?.firstName ? `, ${user.firstName}` : ''}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors mt-1"
          >
            Sign out
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">Total Customers</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">—</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">Active Workflows</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">—</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500">Integrations</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">—</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-base font-medium text-gray-900 mb-4">
            Recent Activity
          </h2>
          <p className="text-sm text-gray-400">
            No activity yet. Your workflow events will appear here.
          </p>
        </div>
      </div>
    </main>
  );
}
