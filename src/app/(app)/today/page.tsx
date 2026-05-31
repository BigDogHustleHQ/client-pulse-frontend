'use client';

import { AIReplyDraft, MockAIProvider } from '@/components/ai';
import {
  Btn,
  Grid,
  Inline,
  KPI,
  Panel,
  PanelHead,
  ProgressBar,
} from '@/components/primitives';
import { PageError, PageLoading } from '@/components/shell/page-state';
import { useToday } from '@/hooks/use-today';

export default function TodayPage() {
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
        {today.shortcuts.map((s) => (
          <Btn
            key={s.id}
            variant={s.id === 'post' ? 'default' : 'secondary'}
            size="sm"
          >
            {s.label}
          </Btn>
        ))}
      </Inline>

      <Grid cols={4} gap="md" className="max-md:grid-cols-2">
        {today.kpis.map((k) => (
          <KPI
            key={k.id}
            label={k.label}
            value={k.value}
            delta={k.delta}
            deltaLabel={k.deltaLabel}
            positiveIsGood={k.positiveIsGood}
          />
        ))}
      </Grid>

      <Grid cols={2} gap="md" className="max-lg:grid-cols-1">
        <Panel>
          <PanelHead
            title="AI action tiles"
            description="Approve, edit, or skip"
          />
          <div className="flex flex-col gap-3">
            {today.aiActions.map((a) => (
              <MockAIProvider key={a.id} tokens={[a.draft]} delay={0}>
                <AIReplyDraft
                  title={a.title}
                  prompt={a.prompt}
                  confidence={a.confidence}
                />
              </MockAIProvider>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHead
            title="Today's goals"
            description="Where you stand right now"
          />
          <div className="flex flex-col gap-4">
            {today.goals.map((g) => (
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
      </Grid>
    </div>
  );
}
