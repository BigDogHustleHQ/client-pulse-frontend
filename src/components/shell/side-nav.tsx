'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from './nav-config';

export function SideNav() {
  const pathname = usePathname();

  return (
    <nav
      data-slot="side-nav"
      aria-label="Primary"
      className="hidden h-full w-56 shrink-0 flex-col gap-1 border-r border-border bg-card px-3 py-4 lg:flex"
    >
      <Link href="/today" className="mb-4 flex items-center gap-2 px-2">
        <span className="grid size-7 place-content-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
          C
        </span>
        <span className="font-heading text-base font-semibold">
          ClientPulse
        </span>
      </Link>

      {NAV_ITEMS.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.slug}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
            )}
          >
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
