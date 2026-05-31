'use client';

import { Check, Sparkles, TriangleAlert, X } from 'lucide-react';
import {
  Btn,
  Grid,
  Inline,
  KPI,
  MiniTable,
  Panel,
  PanelHead,
  Pill,
} from '@/components/primitives';
import type { MiniTableColumn } from '@/components/primitives';
import { ConversionFunnel, Sparkline } from '@/components/charts';
import { PageError, PageLoading } from '@/components/shell/page-state';
import { useInsights } from '@/hooks/use-insights';
import type { InsightsPriceRow, InsightsProCon } from '@/types/insights';

const priceColumns: MiniTableColumn<InsightsPriceRow>[] = [
  { key: 'item', header: 'Item', align: 'left' },
  { key: 'you', header: 'You', align: 'right' },
  { key: 'market', header: 'Mkt', align: 'right' },
  {
    key: 'delta',
    header: 'Δ',
    align: 'right',
    render: (row) => (
      <Pill
        tone={row.delta < 0 ? 'success' : row.delta > 0 ? 'danger' : 'neutral'}
      >
        {row.delta > 0 ? '+' : ''}
        {row.delta}%
      </Pill>
    ),
  },
];

export default function InsightsPage() {
  const { data, isLoading, isError } = useInsights();

  if (isLoading) return <PageLoading label="Synthesizing your insights…" />;
  if (isError || !data) return <PageError message="Couldn't load Insights." />;

  const insights = data.data;
  const pros = insights.prosCons.filter(
    (p: InsightsProCon) => p.kind === 'pro',
  );
  const cons = insights.prosCons.filter(
    (p: InsightsProCon) => p.kind === 'con',
  );

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

      <Grid cols={2} gap="md" className="max-lg:grid-cols-1">
        <Panel>
          <PanelHead
            title="Customer growth"
            description="New vs returning over the period"
          />
          <Sparkline
            data={insights.growth.trend}
            width={280}
            height={56}
            className="w-full"
          />
          <Inline gap="lg">
            <div className="flex flex-col">
              <span className="font-heading text-xl font-semibold tabular-nums">
                {insights.growth.newCustomers}
              </span>
              <span className="text-xs text-muted-foreground">
                New customers
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xl font-semibold tabular-nums">
                {insights.growth.repeatRate}
              </span>
              <span className="text-xs text-muted-foreground">Repeat rate</span>
            </div>
          </Inline>
          <KPI
            label="Lifetime value"
            value={insights.growth.ltvValue}
            delta={insights.growth.ltvDelta}
            deltaLabel="vs last period"
          />
        </Panel>

        <Panel>
          <PanelHead
            title="Pros & cons"
            description="What's working and what isn't"
          />
          <div className="flex flex-col gap-2">
            {pros.map((p) => (
              <Inline key={p.id} gap="sm">
                <Check className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <Pill tone="success">{p.label}</Pill>
              </Inline>
            ))}
            {cons.map((c) => (
              <Inline key={c.id} gap="sm">
                <X className="size-4 shrink-0 text-destructive" />
                <Pill tone="danger">{c.label}</Pill>
              </Inline>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHead
            title="Competitive pricing"
            description="Your menu vs the local market"
          />
          <MiniTable
            columns={priceColumns}
            data={insights.pricing}
            rowKey={(row) => row.id}
          />
        </Panel>

        <Panel>
          <PanelHead
            title="Drop-off points"
            description="Where bookings leak"
          />
          <ConversionFunnel
            stages={insights.dropOff.stages}
            className="ring-0 p-0 bg-transparent"
          />
          <Inline gap="sm" className="rounded-lg bg-amber-500/10 px-3 py-2">
            <TriangleAlert className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span className="text-xs text-amber-700 dark:text-amber-400">
              Biggest leak at {insights.dropOff.leakAt}
            </span>
          </Inline>
        </Panel>
      </Grid>

      <Panel>
        <PanelHead
          title="Recommendations"
          description={`Generated by ${insights.summary.model}`}
          actions={<Sparkles className="size-4 text-brand" />}
        />
        <div className="flex flex-col gap-3">
          {insights.recommendations.map((rec, i) => (
            <div
              key={rec.id}
              className="flex items-center justify-between gap-3 rounded-lg bg-secondary px-4 py-3 max-sm:flex-col max-sm:items-start"
            >
              <span className="text-sm text-foreground">
                <span className="mr-2 font-medium tabular-nums text-muted-foreground">
                  {i + 1}.
                </span>
                {rec.text}
              </span>
              <Btn variant="secondary" size="sm" className="shrink-0">
                {rec.actionLabel}
              </Btn>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
