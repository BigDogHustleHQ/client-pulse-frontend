'use client';

import { useMemo, useState } from 'react';
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
import { BuilderControls } from '@/components/website/builder-controls';
import { DeviceToggle, type DeviceId } from '@/components/website/device-frame';
import { LivePreview } from '@/components/website/live-preview';
import { useWebsite } from '@/hooks/use-website';
import { cn } from '@/lib/utils';
import type {
  WebsiteConfig,
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
      className="inline-flex max-w-full gap-1 overflow-x-auto rounded-lg bg-secondary p-1"
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
              'rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 active:scale-[0.97] motion-reduce:transition-none motion-reduce:transform-none',
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
function QuestionRow({
  index,
  q,
  onAnswer,
}: {
  index: number;
  q: WebsiteQuestion;
  onAnswer: (q: WebsiteQuestion, value: string) => void;
}) {
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
        <div className="pl-7">
          <Input
            defaultValue={q.answer}
            placeholder={q.placeholder}
            aria-label={q.prompt}
            onChange={(e) => onAnswer(q, e.target.value)}
          />
        </div>
      ) : (
        <Inline gap="sm" className="pl-7">
          {q.options.map((opt) => {
            const picked = q.selected?.includes(opt);
            return (
              <button key={opt} type="button" onClick={() => onAnswer(q, opt)}>
                <Chip
                  className={cn(
                    'cursor-pointer',
                    picked && 'border-brand/40 bg-brand/10 text-brand',
                  )}
                >
                  {opt}
                </Chip>
              </button>
            );
          })}
        </Inline>
      )}
    </div>
  );
}

/** Compact, token-styled thumbnail summarizing a variation preset. */
function VariationThumb({ variation }: { variation: WebsiteVariation }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-muted/40 p-3">
      <div className="flex flex-col items-center gap-1 rounded-md bg-secondary py-5">
        <span className="font-heading text-sm font-semibold tracking-tight">
          {variation.brandName}
        </span>
        <span className="text-[11px] text-muted-foreground">
          {variation.tagline}
        </span>
      </div>
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
  const [generation, setGeneration] = useState(0);
  const [device, setDevice] = useState<DeviceId>('desktop');
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [published, setPublished] = useState(false);

  // Local, editable preview config seeded from the endpoint. Synced during
  // render when a fresh payload arrives (same prev-value pattern as Vendors).
  const seed = data?.data.config;
  const [config, setConfig] = useState<WebsiteConfig | null>(null);
  const [prevSeed, setPrevSeed] = useState(seed);
  if (seed && seed !== prevSeed) {
    setPrevSeed(seed);
    setConfig(seed);
  }

  const palettes = useMemo(() => data?.data.palettes ?? [], [data]);
  const fontPairs = useMemo(() => data?.data.fontPairs ?? [], [data]);

  if (isLoading) return <PageLoading label="Loading the builder…" />;
  if (isError || !data || !config)
    return <PageError message="Couldn't load the builder." />;

  const site = data.data;
  const mode = activeMode ?? site.activeMode;
  const publishUrl = `${site.publishSubdomain}.${site.publishDomain}`;

  function patchConfig(patch: Partial<WebsiteConfig>) {
    setConfig((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  // Simulated, client-only "AI" generation: brief spinner, then bump a counter
  // so the variation grid re-keys and animates back in. No model involved.
  function generate() {
    if (generating) return;
    setGenerating(true);
    setTimeout(() => {
      setGeneration((n) => n + 1);
      setGenerating(false);
    }, 900);
  }

  function pickVariation(variation: WebsiteVariation) {
    setPickedId(variation.id);
    patchConfig(variation.preset);
  }

  // Map a wizard answer onto config where it makes sense (name + CTA + vibe).
  function applyAnswer(q: WebsiteQuestion, value: string) {
    if (q.id === 'name' && value.trim()) patchConfig({ brandName: value });
    if (q.id === 'cta' && value.trim()) patchConfig({ heroCta: value });
    if (q.kind === 'chips' && q.id === 'vibe') {
      if (value === 'Modern') patchConfig({ paletteId: 'modern' });
      if (value === 'Upscale') patchConfig({ paletteId: 'mono' });
      if (value === 'Cozy' || value === 'Rustic')
        patchConfig({ paletteId: 'warm' });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Website Builder
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Answer five questions and AI generates three full-site variations in
            ~30 seconds. Pick one, then edit it live below.
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
            <QuestionRow
              key={q.id}
              index={i + 1}
              q={q}
              onAnswer={applyAnswer}
            />
          ))}
        </Stack>
        <div className="flex">
          <Btn loading={generating} onClick={generate}>
            <Sparkles className="size-4" />
            Generate 3 variations
          </Btn>
        </div>
      </Panel>

      {/* Live builder: controls (left) + rendered preview (right). Stacks on
          small screens; the preview scales to fit so it stays overflow-free. */}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <Panel className="lg:sticky lg:top-4">
          <PanelHead
            title="Customize"
            description="Edits update the preview instantly."
          />
          <BuilderControls
            config={config}
            palettes={palettes}
            fontPairs={fontPairs}
            onChange={patchConfig}
          />
        </Panel>

        <Stack gap="sm" className="min-w-0">
          <Inline gap="sm" className="justify-between">
            <h3 className="font-heading text-lg font-medium">Live preview</h3>
            <DeviceToggle value={device} onChange={setDevice} />
          </Inline>
          <LivePreview
            config={config}
            palettes={palettes}
            fontPairs={fontPairs}
            device={device}
          />
          <Inline gap="sm" className="justify-between">
            {published ? (
              <Pill tone="success">Published → {publishUrl}</Pill>
            ) : (
              <span className="text-xs text-muted-foreground">
                Not published yet
              </span>
            )}
            <Btn size="sm" onClick={() => setPublished(true)}>
              Publish → {publishUrl}
            </Btn>
          </Inline>
        </Stack>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-heading text-lg font-medium">Variations</h3>
        <Grid
          key={`${mode}-${generation}`}
          cols={3}
          gap="md"
          className="max-lg:grid-cols-1! animate-in fade-in slide-in-from-bottom-1 duration-300 motion-reduce:animate-none"
        >
          {site.variations.map((variation) => {
            const picked = variation.id === pickedId;
            return (
              <Card
                key={variation.id}
                size="sm"
                data-slot="variation-card"
                data-picked={picked || undefined}
                className={cn(
                  'transition-all hover:-translate-y-px hover:shadow-sm motion-reduce:transition-none motion-reduce:transform-none',
                  picked && 'ring-2 ring-brand/50',
                )}
              >
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
                  <VariationThumb variation={variation} />
                </CardContent>
                <CardFooter className="gap-2">
                  <Btn
                    size="sm"
                    className="flex-1"
                    variant={picked ? 'secondary' : 'default'}
                    onClick={() => pickVariation(variation)}
                  >
                    {picked ? (
                      <>
                        <Check className="size-3.5" />
                        Applied
                      </>
                    ) : (
                      'Pick'
                    )}
                  </Btn>
                  <Btn
                    size="icon-sm"
                    variant="ghost"
                    aria-label="Regenerate variation"
                    onClick={generate}
                  >
                    <RefreshCw className="size-3.5" />
                  </Btn>
                </CardFooter>
              </Card>
            );
          })}
        </Grid>

        <Inline gap="sm" className="justify-between">
          <Btn
            variant="ghost"
            size="sm"
            loading={generating}
            onClick={generate}
          >
            <Sparkles className="size-3.5" />
            Generate 3 more
          </Btn>
          <Btn size="sm" onClick={() => setPublished(true)}>
            Publish → {publishUrl}
          </Btn>
        </Inline>
      </div>
    </div>
  );
}
