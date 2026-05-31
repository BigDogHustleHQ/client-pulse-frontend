'use client';

import * as React from 'react';
import {
  Activity,
  ClipboardList,
  Link2,
  ListChecks,
  PieChart,
  Sparkles,
  StickyNote,
  Target,
  TrendingUp,
} from 'lucide-react';
import {
  AIReplyDraft,
  DraftStatus,
  MockAIProvider,
  type DraftResolution,
} from '@/components/ai';
import {
  Btn,
  KPI,
  MiniTable,
  Panel,
  PanelHead,
  ProgressBar,
} from '@/components/primitives';
import type { MiniTableColumn } from '@/components/primitives';
import { Donut, Sparkline } from '@/components/charts';
import type { TodayAiAction, TodayData, TodayKpi } from '@/types/today';
import type { WidgetCatalog, WidgetInstance } from './types';

/** One AI action tile that the owner can approve, edit, or reject. */
function AiActionTile({ action }: { action: TodayAiAction }) {
  const [resolution, setResolution] = React.useState<DraftResolution | null>(
    null,
  );

  if (resolution) {
    return (
      <Panel>
        <PanelHead>
          <h3 className="font-heading text-base leading-snug font-medium">
            {action.title}
          </h3>
        </PanelHead>
        <DraftStatus
          resolution={resolution}
          onUndo={() => setResolution(null)}
        />
      </Panel>
    );
  }

  return (
    <MockAIProvider tokens={[action.draft]} delay={0}>
      <AIReplyDraft
        title={action.title}
        prompt={action.prompt}
        confidence={action.confidence}
        onApprove={() => setResolution('approved')}
        onReject={() => setResolution('rejected')}
      />
    </MockAIProvider>
  );
}

/** A small editable scratch note persisted only in component state. */
function NoteWidget() {
  const [text, setText] = React.useState('');
  return (
    <Panel>
      <PanelHead title="Note" description="A quick scratchpad for the day" />
      <textarea
        data-slot="widget-note"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Jot down a reminder…"
        rows={4}
        className="w-full resize-none rounded-lg bg-secondary px-3 py-2 text-sm text-foreground outline-none ring-1 ring-foreground/10 placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-foreground/20"
      />
    </Panel>
  );
}

const shortcutColumns: MiniTableColumn<{ id: string; label: string }>[] = [
  { key: 'label', header: 'Shortcut', align: 'left' },
];

/**
 * Build a Today catalog bound to the loaded data. Each KPI becomes its own
 * single-instance widget so the default layout reproduces the original 4-up KPI
 * grid; additional composite widgets (goals, AI tiles, trends) can be added.
 */
export function buildTodayCatalog(data: TodayData): WidgetCatalog<TodayData> {
  const kpiEntries: WidgetCatalog<TodayData> = data.kpis.map(
    (kpi: TodayKpi) => ({
      type: `kpi-${kpi.id}`,
      label: kpi.label,
      description: 'Key metric',
      icon: Activity,
      defaultSize: 'sm',
      render: (d: TodayData) => {
        const k = d.kpis.find((x) => x.id === kpi.id);
        if (!k) return null;
        return (
          <KPI
            label={k.label}
            value={k.value}
            delta={k.delta}
            deltaLabel={k.deltaLabel}
            positiveIsGood={k.positiveIsGood}
          />
        );
      },
    }),
  );

  const rest: WidgetCatalog<TodayData> = [
    {
      type: 'ai-action-review',
      label: 'AI: review reply',
      description: 'Approve, edit, or skip the review draft',
      icon: Sparkles,
      defaultSize: 'md',
      render: (d) => {
        const action = d.aiActions[0];
        if (!action) return null;
        return (
          <Panel>
            <PanelHead
              title="AI action — review"
              description="Approve, edit, or skip"
            />
            <AiActionTile action={action} />
          </Panel>
        );
      },
    },
    {
      type: 'ai-action-promo',
      label: 'AI: promo draft',
      description: 'Approve, edit, or skip the promo draft',
      icon: Sparkles,
      defaultSize: 'md',
      render: (d) => {
        const action = d.aiActions[1];
        if (!action) return null;
        return (
          <Panel>
            <PanelHead
              title="AI action — promo"
              description="Approve, edit, or skip"
            />
            <AiActionTile action={action} />
          </Panel>
        );
      },
    },
    {
      type: 'goals',
      label: "Today's goals",
      description: 'Progress toward your daily targets',
      icon: Target,
      defaultSize: 'md',
      render: (d) => (
        <Panel>
          <PanelHead
            title="Today's goals"
            description="Where you stand right now"
          />
          <div className="flex flex-col gap-4">
            {d.goals.map((g) => (
              <ProgressBar
                key={g.id}
                label={g.label}
                value={g.value}
                max={g.target}
                showValue
                tone="brand"
              />
            ))}
          </div>
        </Panel>
      ),
    },
    {
      type: 'covers-progress',
      label: 'Covers goal',
      description: 'Progress toward the covers target',
      icon: ListChecks,
      defaultSize: 'sm',
      render: (d) => {
        const goal = d.goals.find((g) => g.id === 'covers-goal') ?? d.goals[0];
        if (!goal) return null;
        return (
          <Panel>
            <PanelHead title="Covers goal" description={goal.label} />
            <ProgressBar
              label={goal.label}
              value={goal.value}
              max={goal.target}
              showValue
              tone="brand"
            />
          </Panel>
        );
      },
    },
    {
      type: 'goals-trend',
      label: 'Goal trend',
      description: 'Goal completion as a sparkline',
      icon: TrendingUp,
      defaultSize: 'sm',
      render: (d) => (
        <Panel>
          <PanelHead title="Goal trend" description="Recent completion" />
          <Sparkline
            data={d.goals.map((g) =>
              g.target === 0 ? 0 : Math.round((g.value / g.target) * 100),
            )}
            width={280}
            height={56}
            className="w-full"
          />
        </Panel>
      ),
    },
    {
      type: 'goals-donut',
      label: 'Goals donut',
      description: 'Goal progress as a donut',
      icon: PieChart,
      defaultSize: 'sm',
      render: (d) => (
        <Donut
          className="ring-0"
          totalLabel="Goals"
          total={d.goals.length}
          data={d.goals.map((g) => ({ label: g.label, value: g.value }))}
        />
      ),
    },
    {
      type: 'shortcuts-table',
      label: 'Quick links',
      description: 'Your Today shortcuts as a list',
      icon: Link2,
      defaultSize: 'sm',
      render: (d) => (
        <Panel>
          <PanelHead title="Quick links" description="Jump back in" />
          <MiniTable
            columns={shortcutColumns}
            data={d.shortcuts}
            rowKey={(row) => row.id}
          />
        </Panel>
      ),
    },
    {
      type: 'narrative',
      label: 'Daily briefing',
      description: 'The AI morning narrative',
      icon: ClipboardList,
      defaultSize: 'md',
      render: (d) => (
        <Panel>
          <PanelHead title="Daily briefing" description={d.greeting} />
          <p className="text-sm leading-relaxed text-foreground">
            {d.narrative}
          </p>
          <Btn variant="secondary" size="sm" className="self-start">
            Ask a follow-up
          </Btn>
        </Panel>
      ),
    },
    {
      type: 'note',
      label: 'Note',
      description: 'An editable scratchpad',
      icon: StickyNote,
      defaultSize: 'sm',
      render: () => <NoteWidget />,
    },
  ];

  return [...kpiEntries, ...rest];
}

/**
 * The seeded default Today layout: the 4 KPI widgets, the two AI action tiles,
 * and the goals panel — reproducing the original page content so existing e2e
 * assertions (4 KPIs, 2 ai-reply-draft tiles) keep passing.
 */
export function defaultTodayLayout(data: TodayData): WidgetInstance[] {
  const kpiInstances: WidgetInstance[] = data.kpis.map((k) => ({
    id: `kpi-${k.id}`,
    type: `kpi-${k.id}`,
  }));
  return [
    ...kpiInstances,
    { id: 'ai-action-review', type: 'ai-action-review' },
    { id: 'ai-action-promo', type: 'ai-action-promo' },
    { id: 'goals', type: 'goals' },
  ];
}
