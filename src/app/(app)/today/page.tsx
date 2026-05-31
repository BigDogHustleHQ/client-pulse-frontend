'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Btn, Inline } from '@/components/primitives';
import { PageError, PageLoading } from '@/components/shell/page-state';
import {
  WidgetBoard,
  buildTodayCatalog,
  defaultTodayLayout,
} from '@/components/widgets';
import { useToday } from '@/hooks/use-today';
import type { TodayData } from '@/types/today';

// Maps each Today shortcut (today.shortcuts ids from the mock) to the product
// route it opens. Unknown ids fall through to no navigation.
const SHORTCUT_ROUTES: Record<string, string> = {
  post: '/social',
  reservation: '/reservations',
  ask: '/workflows',
  site: '/website',
};

export default function TodayPage() {
  const router = useRouter();
  const { data, isLoading, isError } = useToday();

  if (isLoading) return <PageLoading label="Loading your morning…" />;
  if (isError || !data) return <PageError message="Couldn't load Today." />;

  const today = data.data;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          {today.greeting} ☕
        </h2>
        <p className="max-w-3xl text-sm text-muted-foreground">
          {today.narrative}
        </p>
      </div>

      <Inline gap="sm">
        {today.shortcuts.map((s) => {
          const href = SHORTCUT_ROUTES[s.id];
          return (
            <Btn
              key={s.id}
              variant={s.id === 'post' ? 'default' : 'secondary'}
              size="sm"
              onClick={href ? () => router.push(href) : undefined}
            >
              {s.label}
            </Btn>
          );
        })}
      </Inline>

      <WidgetBoard<TodayData>
        page="today"
        title="Your dashboard"
        data={today}
        catalog={buildTodayCatalog(today)}
        defaultLayout={() => defaultTodayLayout(today)}
      />
    </div>
  );
}
