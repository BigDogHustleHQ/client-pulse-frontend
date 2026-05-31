'use client';

import { Sparkles } from 'lucide-react';
import { Inline, Panel, PanelHead, Pill } from '@/components/primitives';
import { PageError, PageLoading } from '@/components/shell/page-state';
import {
  WidgetBoard,
  defaultInsightsLayout,
  insightsCatalog,
} from '@/components/widgets';
import { useInsights } from '@/hooks/use-insights';
import type { InsightsData } from '@/types/insights';

export default function InsightsPage() {
  const { data, isLoading, isError } = useInsights();

  if (isLoading) return <PageLoading label="Synthesizing your insights…" />;
  if (isError || !data) return <PageError message="Couldn't load Insights." />;

  const insights = data.data;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          Insights
        </h2>
        <p className="text-sm text-muted-foreground">
          Period: {insights.period}
        </p>
      </div>

      <Panel>
        <PanelHead
          title="Executive summary"
          description={`Cross-module synthesis · ${insights.summary.model}`}
          actions={<Sparkles className="size-4 text-brand" />}
        />
        <p className="max-w-3xl text-sm leading-relaxed text-foreground">
          {insights.summary.narrative}
        </p>
        <Inline gap="sm">
          {insights.summary.highlights.map((h) => (
            <Pill
              key={h.id}
              tone={h.kind === 'strength' ? 'success' : 'warning'}
            >
              {h.label}
            </Pill>
          ))}
        </Inline>
      </Panel>

      <WidgetBoard<InsightsData>
        page="insights"
        title="Analytics"
        data={insights}
        catalog={insightsCatalog}
        defaultLayout={defaultInsightsLayout}
      />
    </div>
  );
}
