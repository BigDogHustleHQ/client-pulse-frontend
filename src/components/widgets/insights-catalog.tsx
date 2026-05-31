'use client';

import * as React from 'react';
import {
  Check,
  DollarSign,
  Filter,
  Lightbulb,
  ListChecks,
  TrendingUp,
  TriangleAlert,
  Users,
  X,
} from 'lucide-react';
import {
  Btn,
  Inline,
  KPI,
  MiniTable,
  Panel,
  PanelHead,
  Pill,
} from '@/components/primitives';
import type { MiniTableColumn } from '@/components/primitives';
import { ConversionFunnel, Sparkline } from '@/components/charts';
import type {
  InsightsData,
  InsightsPriceRow,
  InsightsProCon,
} from '@/types/insights';
import type { WidgetCatalog, WidgetInstance } from './types';

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

/**
 * The Insights widget catalog. Each analytics panel becomes a single-instance
 * widget so the page is fully customizable while still reproducing the original
 * layout from its default.
 */
export const insightsCatalog: WidgetCatalog<InsightsData> = [
  {
    type: 'growth',
    label: 'Customer growth',
    description: 'New vs returning over the period',
    icon: Users,
    defaultSize: 'md',
    render: (insights) => (
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
            <span className="text-xs text-muted-foreground">New customers</span>
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
    ),
  },
  {
    type: 'pros-cons',
    label: 'Pros & cons',
    description: "What's working and what isn't",
    icon: ListChecks,
    defaultSize: 'md',
    render: (insights) => {
      const pros = insights.prosCons.filter(
        (p: InsightsProCon) => p.kind === 'pro',
      );
      const cons = insights.prosCons.filter(
        (p: InsightsProCon) => p.kind === 'con',
      );
      return (
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
      );
    },
  },
  {
    type: 'pricing',
    label: 'Competitive pricing',
    description: 'Your menu vs the local market',
    icon: DollarSign,
    defaultSize: 'md',
    render: (insights) => (
      <Panel>
        <PanelHead
          title="Competitive pricing"
          description="Your menu vs the local market"
        />
        <div className="overflow-x-auto">
          <MiniTable
            columns={priceColumns}
            data={insights.pricing}
            rowKey={(row) => row.id}
          />
        </div>
      </Panel>
    ),
  },
  {
    type: 'drop-off',
    label: 'Drop-off points',
    description: 'Where bookings leak',
    icon: Filter,
    defaultSize: 'md',
    render: (insights) => (
      <Panel>
        <PanelHead title="Drop-off points" description="Where bookings leak" />
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
    ),
  },
  {
    type: 'recommendations',
    label: 'Recommendations',
    description: 'AI-generated next steps',
    icon: Lightbulb,
    defaultSize: 'lg',
    render: (insights) => (
      <Panel>
        <PanelHead
          title="Recommendations"
          description={`Generated by ${insights.summary.model}`}
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
    ),
  },
  {
    type: 'ltv-kpi',
    label: 'Lifetime value',
    description: 'LTV as a standalone KPI',
    icon: TrendingUp,
    defaultSize: 'sm',
    render: (insights) => (
      <KPI
        label="Lifetime value"
        value={insights.growth.ltvValue}
        delta={insights.growth.ltvDelta}
        deltaLabel="vs last period"
      />
    ),
  },
  {
    type: 'highlights',
    label: 'Highlights',
    description: 'Strengths and risks as pills',
    icon: ListChecks,
    defaultSize: 'md',
    render: (insights) => (
      <Panel>
        <PanelHead title="Highlights" description="Strengths and risks" />
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
    ),
  },
];

/**
 * The seeded default Insights layout — the five original analytics panels in
 * their original order, so existing e2e panel assertions keep passing.
 */
export function defaultInsightsLayout(): WidgetInstance[] {
  return [
    { id: 'growth', type: 'growth' },
    { id: 'pros-cons', type: 'pros-cons' },
    { id: 'pricing', type: 'pricing' },
    { id: 'drop-off', type: 'drop-off' },
    { id: 'recommendations', type: 'recommendations' },
  ];
}
