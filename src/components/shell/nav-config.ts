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

export const NAV_ITEMS: NavItem[] = [
  { slug: 'today', label: 'Today', href: '/today', icon: LayoutDashboard },
  { slug: 'inbox', label: 'Inbox', href: '/inbox', icon: Inbox },
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
  { slug: 'workflows', label: 'Workflows', href: '/workflows', icon: Workflow },
  { slug: 'vendors', label: 'Vendors', href: '/vendors', icon: Store },
  { slug: 'website', label: 'Website Builder', href: '/website', icon: Globe },
  { slug: 'insights', label: 'Insights', href: '/insights', icon: LineChart },
  { slug: 'settings', label: 'Settings', href: '/settings', icon: Settings },
];
