'use client';

import { TriangleAlert } from 'lucide-react';
import {
  Btn,
  Grid,
  KPI,
  MiniTable,
  Panel,
  PanelHead,
  Pill,
} from '@/components/primitives';
import type { MiniTableColumn } from '@/components/primitives';
import {
  CohortGrid,
  ConversionFunnel,
  Donut,
  funnelPercents,
} from '@/components/charts';
import { PageError, PageLoading } from '@/components/shell/page-state';
import { useReservations } from '@/hooks/use-reservations';
import type {
  ReservationsData,
  WaitlistEntry,
  WaitlistStatus,
} from '@/types/reservations';

const STATUS_TONE: Record<
  WaitlistStatus,
  'warning' | 'success' | 'info' | 'danger'
> = {
  held: 'warning',
  sent: 'info',
  seated: 'success',
  expired: 'danger',
};

const waitlistColumns: MiniTableColumn<WaitlistEntry>[] = [
  { key: 'party', header: 'Party' },
  { key: 'size', header: 'Size', align: 'right' },
  { key: 'quoted', header: 'Quoted', align: 'right' },
  {
    key: 'status',
    header: 'Status',
    align: 'right',
    render: (row) => (
      <Pill tone={STATUS_TONE[row.status]}>{row.statusLabel}</Pill>
    ),
  },
];

function biggestLeakText(funnel: ReservationsData['funnel']): string {
  const { stages, biggestLeakStage } = funnel;
  const i = Math.min(Math.max(biggestLeakStage, 1), stages.length - 1);
  const pct = funnelPercents(stages)[i]?.ofPrevious ?? 0;
  const dropped = Math.round(100 - pct);
  return `${stages[i - 1].label} → ${stages[i].label}: ${dropped}% drop off`;
}

export default function ReservationsPage() {
  const { data, isLoading, isError } = useReservations();

  if (isLoading) return <PageLoading label="Loading reservations…" />;
  if (isError || !data)
    return <PageError message="Couldn't load Reservations." />;

  const reservations = data.data;
  const channelTotal = reservations.channels.reduce(
    (acc, c) => acc + c.value,
    0,
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            {reservations.title}
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground">
            {reservations.narrative}
          </p>
        </div>
        <Btn size="sm">+ Add booking</Btn>
      </div>

      <Grid cols={4} gap="md" className="max-md:grid-cols-2">
        {reservations.kpis.map((k) => (
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
            title="Conversion funnel"
            description="Widget views → confirmed"
          />
          <div className="flex flex-col gap-3">
            <ConversionFunnel stages={reservations.funnel.stages} />
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
              <TriangleAlert className="size-4 shrink-0" />
              <span>Biggest leak: {biggestLeakText(reservations.funnel)}</span>
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelHead
            title="Channel mix"
            description="Where bookings originate"
          />
          <div className="flex justify-center">
            <Donut
              data={reservations.channels}
              total={channelTotal}
              totalLabel="bookings"
              formatTotal={(t) => `${t}%`}
              className="bg-transparent ring-0 p-0"
            />
          </div>
        </Panel>
      </Grid>

      <Grid cols={2} gap="md" className="max-lg:grid-cols-1">
        <Panel>
          <PanelHead
            title="Waitlist auto-fill"
            description="Hold, notify, and seat parties"
          />
          <div className="flex flex-col gap-3">
            <MiniTable
              columns={waitlistColumns}
              data={reservations.waitlist}
              rowKey={(row) => row.id}
              empty="No one waiting"
            />
            <div>
              <Btn variant="secondary" size="sm">
                Auto-fill from waitlist
              </Btn>
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelHead
            title="Repeat bookings"
            description="30/60/90-day retention"
          />
          <CohortGrid
            cohorts={reservations.cohorts}
            periods={3}
            periodLabel={(i) => `D${(i + 1) * 30}`}
            className="bg-transparent ring-0 p-0"
          />
        </Panel>
      </Grid>
    </div>
  );
}
