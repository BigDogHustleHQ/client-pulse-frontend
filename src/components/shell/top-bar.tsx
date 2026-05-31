'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, ChevronDown, LogOut, Search, Settings } from 'lucide-react';
import { Badge } from '@/components/primitives';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from './nav-config';
import { MobileNav } from './mobile-nav';

const TENANT_NAME = "Bella's Bistro";

const NOTIFICATIONS = [
  {
    id: 'review',
    title: 'New 4★ Google review',
    detail: 'Jordan left a review 12 minutes ago',
  },
  {
    id: 'reservation',
    title: 'Reservation request',
    detail: 'Party of 6 for Friday at 7:30pm',
  },
  {
    id: 'workflow',
    title: 'Workflow needs sign-off',
    detail: 'Slow Tuesday promo is ready to send',
  },
] as const;

const OTHER_TENANTS = ['Harbor Coffee', 'Maple & Main'] as const;

export function TopBar() {
  const pathname = usePathname();
  const active = NAV_ITEMS.find(
    (i) => pathname === i.href || pathname.startsWith(`${i.href}/`),
  );

  const [unread, setUnread] = useState<number>(NOTIFICATIONS.length);

  return (
    <header
      data-slot="top-bar"
      className="flex h-14 shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border bg-card px-4 sm:px-6"
    >
      <div className="flex min-w-0 items-center gap-2">
        <MobileNav />
        <h1 className="truncate font-heading text-lg font-semibold">
          {active?.label ?? 'ClientPulse'}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          data-slot="topbar-search"
          aria-label="Search"
          className={cn(
            'flex items-center gap-2 rounded-lg border border-border bg-secondary text-sm text-muted-foreground transition-colors hover:text-foreground motion-reduce:transition-none',
            'size-9 justify-center sm:size-auto sm:w-72 sm:max-w-md sm:justify-start sm:px-3 sm:py-1.5',
          )}
        >
          <Search className="size-4 shrink-0" />
          <span className="hidden flex-1 text-left sm:inline">Search…</span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Notifications"
            className="relative grid size-9 place-content-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground motion-reduce:transition-none"
          >
            <Bell className="size-4.5" />
            {unread > 0 && (
              <Badge
                tone="danger"
                size="sm"
                count={unread}
                className="absolute top-1 right-1"
              />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            data-slot="notifications-menu"
            align="end"
            className="w-80"
          >
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {NOTIFICATIONS.map((note) => (
              <DropdownMenuItem
                key={note.id}
                className="flex-col items-start gap-0.5 py-2"
              >
                <span className="text-sm font-medium text-foreground">
                  {note.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {note.detail}
                </span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setUnread(0);
              }}
            >
              Mark all as read
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Account"
            className="flex items-center gap-2 rounded-lg py-1 pr-1 pl-2 transition-colors hover:bg-secondary motion-reduce:transition-none"
          >
            <span className="grid size-7 place-content-center rounded-full bg-brand text-xs font-semibold text-brand-foreground">
              BB
            </span>
            <span className="hidden text-sm font-medium sm:inline">
              {TENANT_NAME}
            </span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            data-slot="profile-menu"
            align="end"
            className="w-56"
          >
            <DropdownMenuLabel>{TENANT_NAME}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Switch tenant</DropdownMenuLabel>
            {OTHER_TENANTS.map((tenant) => (
              <DropdownMenuItem key={tenant}>{tenant}</DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              <LogOut />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
