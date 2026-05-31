'use client';

import * as React from 'react';
import * as Icons from 'lucide-react';
import { Plug } from 'lucide-react';
import { ToneSlider } from '@/components/ai';
import {
  Btn,
  Grid,
  Inline,
  MiniTable,
  Panel,
  PanelHead,
  Pill,
  ProgressBar,
  Stack,
  StatusDot,
  type MiniTableColumn,
} from '@/components/primitives';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { PageError, PageLoading } from '@/components/shell/page-state';
import { useSettings } from '@/hooks/use-settings';
import { cn } from '@/lib/utils';
import type {
  IntegrationProvider,
  NotificationPref,
  TeamMember,
} from '@/types/settings';

type SectionId = 'integrations' | 'brand' | 'budget' | 'team' | 'notifications';

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: 'integrations', label: 'Integrations' },
  { id: 'brand', label: 'Brand' },
  { id: 'budget', label: 'Budget' },
  { id: 'team', label: 'Team' },
  { id: 'notifications', label: 'Notifications' },
];

/** Render a lucide icon by name, falling back to a generic plug. */
function IntegrationIcon({ name }: { name: string }) {
  const lib = Icons as unknown as Record<
    string,
    React.ComponentType<{ className?: string }>
  >;
  const Icon = lib[name] ?? Plug;
  return <Icon className="size-5" />;
}

/** Local section nav strip — built inline, not extracted to components/*. */
function SectionTabs({
  active,
  onSelect,
}: {
  active: SectionId;
  onSelect: (id: SectionId) => void;
}) {
  return (
    <nav aria-label="Settings sections">
      <Inline gap="xs">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s.id)}
            aria-current={active === s.id ? 'page' : undefined}
            className={cn(
              'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
              active === s.id
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {s.label}
          </button>
        ))}
      </Inline>
    </nav>
  );
}

/** Local integration card — built inline per the page spec. */
function IntegrationCard({
  integration,
}: {
  integration: IntegrationProvider;
}) {
  return (
    <Panel className="gap-3">
      <div className="flex items-start justify-between gap-2">
        <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-foreground">
          <IntegrationIcon name={integration.icon} />
        </span>
        <StatusDot
          tone={integration.connected ? 'online' : 'offline'}
          label={integration.connected ? 'Connected' : 'Not linked'}
        />
      </div>
      <div className="flex flex-col gap-0.5">
        <h3 className="font-heading text-base font-medium leading-snug">
          {integration.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {integration.description}
        </p>
      </div>
      <Btn
        variant={integration.connected ? 'secondary' : 'default'}
        size="sm"
        className="self-start"
      >
        {integration.connected ? 'Revoke' : 'Connect'}
      </Btn>
    </Panel>
  );
}

const ROLE_TONE: Record<
  TeamMember['role'],
  React.ComponentProps<typeof Pill>['tone']
> = {
  Owner: 'brand',
  Admin: 'primary',
  Member: 'neutral',
};

export default function SettingsPage() {
  const { data, isLoading, isError } = useSettings();
  const [active, setActive] = React.useState<SectionId>('integrations');
  const [tone, setTone] = React.useState(0);
  const [selectedTier, setSelectedTier] = React.useState('');
  const [notifs, setNotifs] = React.useState<Record<string, boolean>>({});
  const hydrated = React.useRef(false);

  const settings = data?.data;

  // Seed local UI state from the fetched mock once it arrives.
  React.useEffect(() => {
    if (!settings || hydrated.current) return;
    hydrated.current = true;
    setTone(settings.brand.tone);
    setSelectedTier(settings.budget.selectedTierId);
    setNotifs(
      Object.fromEntries(settings.notifications.map((n) => [n.id, n.enabled])),
    );
  }, [settings]);

  if (isLoading) return <PageLoading label="Loading settings…" />;
  if (isError || !settings)
    return <PageError message="Couldn't load Settings." />;

  const { integrations, brand, budget, team, notifications } = settings;

  const teamColumns: MiniTableColumn<TeamMember>[] = [
    { key: 'name', header: 'Member', render: (m) => m.name },
    {
      key: 'email',
      header: 'Email',
      render: (m) => <span className="text-muted-foreground">{m.email}</span>,
    },
    {
      key: 'role',
      header: 'Role',
      align: 'right',
      render: (m) => <Pill tone={ROLE_TONE[m.role]}>{m.role}</Pill>,
    },
  ];

  const show = (id: SectionId) => active === id;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          Settings
        </h2>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Connect tools, shape your brand voice, and manage your team.
        </p>
      </div>

      <SectionTabs active={active} onSelect={setActive} />

      {show('integrations') && (
        <Stack gap="md">
          <PanelHead
            title="Integrations"
            description="Connect the tools that feed ClientPulse."
          />
          <Grid
            cols={3}
            gap="md"
            className="max-lg:grid-cols-2 max-sm:grid-cols-1"
          >
            {integrations.map((i) => (
              <IntegrationCard key={i.id} integration={i} />
            ))}
          </Grid>
        </Stack>
      )}

      {show('brand') && (
        <Panel>
          <PanelHead
            title="Brand profile"
            description="This shapes how AI outputs sound."
          />
          <Stack gap="md">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Business</span>
                <span className="font-heading text-base font-medium">
                  {brand.name}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Palette</span>
                <Inline gap="xs">
                  {brand.palette.map((c) => (
                    <span
                      key={c}
                      className="size-5 rounded-full ring-1 ring-foreground/10"
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </Inline>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">
                  Typography
                </span>
                <span className="text-sm">{brand.typography}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Voice</span>
              <span className="text-sm">{brand.voice}</span>
            </div>
            <ToneSlider
              label="Brand voice"
              value={tone}
              onChange={setTone}
              stops={['Formal', 'Balanced', 'Playful']}
              className="max-w-md"
            />
          </Stack>
        </Panel>
      )}

      {show('budget') && (
        <Panel>
          <PanelHead
            title="Budget tier"
            description="Cap monthly AI spend by plan."
          />
          <Stack gap="md">
            <Grid cols={4} gap="sm" className="max-sm:grid-cols-2">
              {budget.tiers.map((t) => {
                const selected = selectedTier === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTier(t.id)}
                    aria-pressed={selected}
                    className={cn(
                      'flex flex-col items-start gap-0.5 rounded-xl p-3 text-left ring-1 transition-colors',
                      selected
                        ? 'bg-secondary ring-brand'
                        : 'bg-card ring-foreground/10 hover:ring-foreground/20',
                    )}
                  >
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <StatusDot tone={selected ? 'brand' : 'offline'} />
                      {t.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ${t.priceCap}/mo
                    </span>
                  </button>
                );
              })}
            </Grid>
            <ProgressBar
              label={`AI spend — $${budget.spend} / $${budget.budget} this month`}
              value={budget.spend}
              max={budget.budget}
              showValue
              tone={budget.spend / budget.budget >= 0.8 ? 'warning' : 'brand'}
            />
          </Stack>
        </Panel>
      )}

      {show('team') && (
        <Panel>
          <PanelHead title="Team" description="Members and their roles." />
          <MiniTable<TeamMember>
            columns={teamColumns}
            data={team}
            rowKey={(m) => m.id}
          />
        </Panel>
      )}

      {show('notifications') && (
        <Panel>
          <PanelHead
            title="Notifications"
            description="Choose what we ping you about."
          />
          <Stack gap="sm">
            {notifications.map((n: NotificationPref) => (
              <Label
                key={n.id}
                htmlFor={`notif-${n.id}`}
                className="items-start gap-3"
              >
                <Checkbox
                  id={`notif-${n.id}`}
                  checked={notifs[n.id] ?? false}
                  onCheckedChange={(v) =>
                    setNotifs((prev) => ({ ...prev, [n.id]: v === true }))
                  }
                  className="mt-0.5"
                />
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{n.label}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {n.description}
                  </span>
                </span>
              </Label>
            ))}
          </Stack>
        </Panel>
      )}
    </div>
  );
}
