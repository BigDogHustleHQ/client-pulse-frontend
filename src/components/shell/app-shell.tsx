import { SideNav } from './side-nav';
import { TopBar } from './top-bar';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-slot="app-shell"
      className="flex h-dvh overflow-hidden bg-background"
    >
      <SideNav />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
