'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_SECTIONS } from './nav-config';

const STORAGE_KEY = 'cp:sidenav:collapsed';

function readCollapsed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function writeCollapsed(value: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // ignore
  }
}

export function SideNav() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<boolean>(false);

  // Hydrate the persisted collapse state after mount. This is the documented
  // exception to set-state-in-effect: the server can't read localStorage, so we
  // render the default (expanded) and reconcile on the client to avoid an SSR
  // hydration mismatch.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate persisted UI state post-mount to avoid SSR mismatch
    setCollapsed(readCollapsed());
  }, []);

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    writeCollapsed(next);
  }

  const mainSections = NAV_SECTIONS.filter((s) => !s.pinBottom);
  const bottomSections = NAV_SECTIONS.filter((s) => s.pinBottom);

  return (
    <nav
      data-slot="side-nav"
      aria-label="Primary"
      className={cn(
        'hidden h-full shrink-0 flex-col border-r border-border bg-card lg:flex',
        'transition-[width] duration-200 motion-reduce:transition-none',
        collapsed ? 'w-14' : 'w-56',
      )}
    >
      {/* Logo / brand */}
      <div
        className={cn(
          'flex h-14 shrink-0 items-center border-b border-border',
          collapsed ? 'justify-center px-0' : 'gap-2 px-3',
        )}
      >
        <Link
          href="/today"
          aria-label="ClientPulse"
          className={cn(
            'flex items-center gap-2',
            collapsed && 'justify-center',
          )}
        >
          <span className="grid size-7 shrink-0 place-content-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            C
          </span>
          {!collapsed && (
            <span className="font-heading text-base font-semibold">
              ClientPulse
            </span>
          )}
        </Link>
      </div>

      {/* Main nav sections */}
      <div className="flex flex-1 flex-col gap-0 overflow-y-auto px-2 py-3">
        {mainSections.map((section) => (
          <div key={section.title} className="mb-3 last:mb-0">
            {!collapsed && (
              <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                {section.title}
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.slug}
                    href={item.href}
                    aria-label={item.label}
                    aria-current={active ? 'page' : undefined}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      'flex items-center rounded-lg px-2.5 py-2 text-sm font-medium transition-colors motion-reduce:transition-none',
                      collapsed ? 'justify-center gap-0' : 'gap-2.5',
                      active
                        ? 'bg-secondary text-foreground'
                        : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    {!collapsed && item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom-pinned sections (Settings) */}
      <div className="flex flex-col gap-0 border-t border-border px-2 py-3">
        {bottomSections.map((section) =>
          section.items.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.slug}
                href={item.href}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
                title={collapsed ? item.label : undefined}
                className={cn(
                  'flex items-center rounded-lg px-2.5 py-2 text-sm font-medium transition-colors motion-reduce:transition-none',
                  collapsed ? 'justify-center gap-0' : 'gap-2.5',
                  active
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
                )}
              >
                <Icon className="size-4 shrink-0" />
                {!collapsed && item.label}
              </Link>
            );
          }),
        )}

        {/* Collapse toggle */}
        <button
          type="button"
          data-slot="sidenav-collapse"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={toggleCollapsed}
          className={cn(
            'mt-1 flex items-center rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground motion-reduce:transition-none',
            collapsed ? 'justify-center gap-0' : 'gap-2.5',
          )}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-4 shrink-0" />
          ) : (
            <>
              <PanelLeftClose className="size-4 shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </nav>
  );
}
