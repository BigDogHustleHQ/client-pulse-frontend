'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { NAV_SECTIONS } from './nav-config';

/**
 * Mobile navigation drawer. Rendered only below lg (1024px) — the hamburger
 * trigger lives in the TopBar and the desktop SideNav rail stays as-is at lg+.
 * Reuses NAV_SECTIONS so the links match the desktop rail exactly. Tapping a
 * link navigates (Next Link) and closes the drawer via controlled open state.
 */
export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open navigation"
        className="grid size-9 shrink-0 place-content-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground lg:hidden"
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-72 max-w-[80vw] gap-0 p-0"
        aria-label="Primary"
      >
        <SheetHeader className="border-b border-border">
          <SheetTitle asChild>
            <Link
              href="/today"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2"
            >
              <span className="grid size-7 place-content-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                C
              </span>
              <span className="font-heading text-base font-semibold">
                ClientPulse
              </span>
            </Link>
          </SheetTitle>
        </SheetHeader>

        <nav
          data-slot="mobile-nav"
          aria-label="Primary"
          className="flex flex-col gap-0 px-3 py-3"
        >
          {NAV_SECTIONS.filter((s) => !s.pinBottom).map((section) => (
            <div key={section.title} className="mb-3 last:mb-0">
              <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                {section.title}
              </p>
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
                      aria-current={active ? 'page' : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors motion-reduce:transition-none',
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
              </div>
            </div>
          ))}

          {/* Bottom-pinned sections rendered inline at the end */}
          {NAV_SECTIONS.filter((s) => s.pinBottom).map((section) =>
            section.items.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.slug}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors motion-reduce:transition-none',
                    active
                      ? 'bg-secondary text-foreground'
                      : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {item.label}
                </Link>
              );
            }),
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
