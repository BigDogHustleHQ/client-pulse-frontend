import {
  LayoutDashboard,
  Inbox,
  CalendarDays,
  CalendarCheck,
  Workflow,
  Store,
  Globe,
  LineChart,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export type NavItem = {
  slug: string;
  label: string;
  href: string;
  icon: LucideIcon;
};

export type NavSection = {
  /** Uppercase label rendered as a section header in the expanded sidebar. */
  title: string;
  items: NavItem[];
  /** When true the section is pinned at the bottom of the sidebar. */
  pinBottom?: boolean;
};

export const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Workspace',
    items: [
      { slug: 'today', label: 'Today', href: '/today', icon: LayoutDashboard },
      { slug: 'inbox', label: 'Inbox', href: '/inbox', icon: Inbox },
    ],
  },
  {
    title: 'Growth',
    items: [
      {
        slug: 'social',
        label: 'Social Studio',
        href: '/social',
        icon: CalendarDays,
      },
      {
        slug: 'reservations',
        label: 'Reservations',
        href: '/reservations',
        icon: CalendarCheck,
      },
      {
        slug: 'workflows',
        label: 'Workflows',
        href: '/workflows',
        icon: Workflow,
      },
      { slug: 'vendors', label: 'Vendors', href: '/vendors', icon: Store },
      {
        slug: 'website',
        label: 'Website Builder',
        href: '/website',
        icon: Globe,
      },
    ],
  },
  {
    title: 'Intelligence',
    items: [
      {
        slug: 'insights',
        label: 'Insights',
        href: '/insights',
        icon: LineChart,
      },
    ],
  },
  {
    title: 'Settings',
    pinBottom: true,
    items: [
      {
        slug: 'settings',
        label: 'Settings',
        href: '/settings',
        icon: Settings,
      },
    ],
  },
];

/** Flat list derived from sections — used by TopBar and other consumers that
 *  only need the items array (e.g. finding the active route label). */
export const NAV_ITEMS: NavItem[] = NAV_SECTIONS.flatMap((s) => s.items);
