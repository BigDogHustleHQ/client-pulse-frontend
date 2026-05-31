'use client';

import { useState } from 'react';
import { Check, RefreshCw, Sparkles } from 'lucide-react';
import {
  Btn,
  Chip,
  Grid,
  Inline,
  Panel,
  PanelHead,
  Pill,
  ProgressBar,
  Stack,
} from '@/components/primitives';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageError, PageLoading } from '@/components/shell/page-state';
import { useWebsite } from '@/hooks/use-website';
import { cn } from '@/lib/utils';
import type {
  WebsiteMode,
  WebsiteModeTab,
  WebsiteQuestion,
  WebsiteVariation,
} from '@/types/website';

/** Inline mode switcher (no library Tabs component exists). */
function ModeTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: WebsiteModeTab[];
  active: WebsiteMode;
  onChange: (mode: WebsiteMode) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Builder mode"
      className="inline-flex gap-1 rounded-lg bg-secondary p-1"
    >
      {tabs.map((tab) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              selected
                ? 'bg-card text-foreground ring-1 ring-foreground/10'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/** One wizard question row — text input or selectable vibe chips. */
function QuestionRow({ index, q }: { index: number; q: WebsiteQuestion }) {
  return (
    <div className="flex flex-col gap-2 border-b border-foreground/10 pb-4 last:border-0 last:pb-0">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'grid size-5 shrink-0 place-content-center rounded-full text-xs font-medium',
            q.done
              ? 'bg-brand/15 text-brand'
              : 'bg-muted text-muted-foreground',
          )}
        >
          {q.done ? <Check className="size-3" /> : index}
        </span>
        <Label className="text-sm font-medium">{q.prompt}</Label>
      </div>

      {q.kind === 'text' ? (
        q.answer ? (
          <p className="pl-7 text-sm text-muted-foreground">{q.answer}</p>
        ) : (
          <div className="pl-7">
            <Input placeholder={q.placeholder} aria-label={q.prompt} />
          </div>
        )
      ) : (
        <Inline gap="sm" className="pl-7">
          {q.options.map((opt) => {
            const picked = q.selected?.includes(opt);
            return (
              <Chip
                key={opt}
                className={cn(
                  picked && 'border-brand/40 bg-brand/10 text-brand',
                )}
              >
                {opt}
              </Chip>
            );
          })}
        </Inline>
      )}
    </div>
  );
}

/** Fake rendered-site thumbnail built from token bg blocks. */
function SitePreview({ variation }: { variation: WebsiteVariation }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-muted/40 p-3">
      {/* hero block */}
      <div className="flex flex-col items-center gap-1 rounded-md bg-secondary py-5">
        <span className="font-heading text-sm font-semibold tracking-tight">
          {variation.brandName}
        </span>
        <span className="text-[11px] text-muted-foreground">
          {variation.tagline}
        </span>
      </div>
      {/* menu blocks */}
      <div className="flex flex-wrap gap-1.5">
        {variation.menuItems.map((item) => (
          <span
            key={item}
            className="rounded bg-muted px-2 py-1 text-[11px] text-muted-foreground"
          >
            {item}
          </span>
        ))}
      </div>
      {/* cta buttons */}
      <div className="flex gap-1.5">
        {variation.ctas.map((cta) => (
          <span
            key={cta}
            className="rounded bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground"
          >
            {cta}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function WebsitePage() {
  const { data, isLoading, isError } = useWebsite();
  const [activeMode, setActiveMode] = useState<WebsiteMode | null>(null);
  const [generating, setGenerating] = useState(false);

  if (isLoading) return <PageLoading label="Loading the builder…" />;
  if (isError || !data)
    return <PageError message="Couldn't load the builder." />;

  const site = data.data;
  const mode = activeMode ?? site.activeMode;
  const publishUrl = `${site.publishSubdomain}.${site.publishDomain}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Website Builder
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Answer five questions and AI generates three full-site variations in
            ~30 seconds. Pick one, refine, or generate more.
          </p>
        </div>
        <ModeTabs tabs={site.modes} active={mode} onChange={setActiveMode} />
      </div>

      <Panel>
        <PanelHead
          title="5 quick questions"
          description="The more you share, the sharper the result."
          actions={
            <Pill tone="brand">
              {site.wizard.completed}/{site.wizard.total}
            </Pill>
          }
        />
        <ProgressBar
          label="Progress"
          value={site.wizard.completed}
          max={site.wizard.total}
          showValue
          tone="brand"
        />
        <Stack gap="md">
          {site.wizard.questions.map((q, i) => (
            <QuestionRow key={q.id} index={i + 1} q={q} />
          ))}
        </Stack>
        <div className="flex">
          <Btn loading={generating} onClick={() => setGenerating((v) => !v)}>
            <Sparkles className="size-4" />
            Generate 3 variations
          </Btn>
        </div>
      </Panel>

      <div className="flex flex-col gap-3">
        <h3 className="font-heading text-lg font-medium">Variations</h3>
        <Grid cols={3} gap="md" className="max-lg:grid-cols-1">
          {site.variations.map((variation) => (
            <Card key={variation.id} size="sm">
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Pill tone={variation.recommended ? 'brand' : 'neutral'}>
                    {variation.recommended
                      ? `${variation.label} · Recommended`
                      : variation.label}
                  </Pill>
                  <span className="text-xs text-muted-foreground">
                    {variation.style}
                  </span>
                </div>
                <SitePreview variation={variation} />
              </CardContent>
              <CardFooter className="gap-2">
                <Btn size="sm" className="flex-1">
                  Pick
                </Btn>
                <Btn
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Regenerate variation"
                >
                  <RefreshCw className="size-3.5" />
                </Btn>
              </CardFooter>
            </Card>
          ))}
        </Grid>

        <Inline gap="sm" className="justify-between">
          <Btn variant="ghost" size="sm">
            <Sparkles className="size-3.5" />
            Generate 3 more
          </Btn>
          <Btn size="sm">Publish → {publishUrl}</Btn>
        </Inline>
      </div>
    </div>
  );
}
