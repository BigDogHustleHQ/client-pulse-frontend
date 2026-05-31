'use client';

import { usePathname } from 'next/navigation';
import { Bell, ChevronDown, Search } from 'lucide-react';
import { Badge } from '@/components/primitives';
import { NAV_ITEMS } from './nav-config';

export function TopBar() {
  const pathname = usePathname();
  const active = NAV_ITEMS.find(
    (i) => pathname === i.href || pathname.startsWith(`${i.href}/`),
  );

  return (
    <header
      data-slot="top-bar"
      className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-6"
    >
      <h1 className="font-heading text-lg font-semibold">
        {active?.label ?? 'ClientPulse'}
      </h1>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Search className="size-3.5" />
          <span className="hidden sm:inline">Search…</span>
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="relative grid size-9 place-content-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Bell className="size-4.5" />
          <Badge
            tone="danger"
            size="sm"
            count={3}
            className="absolute top-1 right-1"
          />
        </button>

        <button
          type="button"
          className="flex items-center gap-2 rounded-lg py-1 pr-1 pl-2 transition-colors hover:bg-secondary"
        >
          <span className="grid size-7 place-content-center rounded-full bg-brand text-xs font-semibold text-brand-foreground">
            BB
          </span>
          <span className="hidden text-sm font-medium sm:inline">
            Bella&apos;s Bistro
          </span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
