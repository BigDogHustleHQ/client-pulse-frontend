'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  AIReplyDraft,
  DraftStatus,
  MockAIProvider,
  type DraftResolution,
} from '@/components/ai';
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
import type { TodayAiAction } from '@/types/today';

// Maps each Today shortcut (today.shortcuts ids from the mock) to the product
// route it opens. Unknown ids fall through to no navigation.
const SHORTCUT_ROUTES: Record<string, string> = {
  post: '/social',
  reservation: '/reservations',
  ask: '/workflows',
  site: '/website',
};

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
              <AiActionTile key={a.id} action={a} />
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
