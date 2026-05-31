# Reservations — funnel + waitlist

Highest-value module for restaurant tenants. KPI strip, booking conversion
funnel with biggest-leak callout, channel attribution donut, waitlist
auto-fill, and 30/60/90 repeat-booking cohorts. Ref: SID-83.

```
┌──────────┬──────────────────────────────────────────────────────────────┐
│ <SideNav>│ <TopBar>  Reservations          Date ▾   [<Btn>+ Add booking] │
│ Reserv. ●│├──────────────────────────────────────────────────────────────┤
│          ││ <Grid cols=4>  KPI strip                                     │
│          ││  <KPI>Booked 86  <KPI>Walk-ins 14  <KPI>No-show risk 5       │
│          ││                                    <KPI>Open slots 23        │
│          ││                                                              │
│          ││ <Grid cols=2>                                               │
│          ││ ┌ <Panel> Conversion funnel ─────┐┌ <Panel> Channel mix ────┐│
│          ││ │ <ConversionFunnel>             ││ <Donut> w/ legend       ││
│          ││ │ Widget views  4,820 ████ 100% ││      ╭───╮  ● Widget 46% ││
│          ││ │ Started        980  █▌   20%  ││     │ 2.4k│ ● Google 31% ││
│          ││ │ Confirmed      412  ▌     9%  ││      ╰───╯  ● Phone  23% ││
│          ││ │ ⚠ Biggest leak: Started→Conf  ││  (centered total)       ││
│          ││ └────────────────────────────────┘└─────────────────────────┘│
│          ││                                                              │
│          ││ ┌ <Panel> Waitlist auto-fill ────┐┌ <Panel> Repeat bookings ┐│
│          ││ │ <MiniTable>                     ││ <CohortGrid> 30/60/90   ││
│          ││ │  Party  Quoted  Status          ││        D30  D60  D90    ││
│          ││ │  Lee  4  7:30  <Pill warn>Held  ││ Jan  ██   ██   █        ││
│          ││ │  Ng   2  8:00  <Pill succ>Sent  ││ Feb  ██   █             ││
│          ││ │  [<Btn>Auto-fill from waitlist] ││ Mar  ██                 ││
│          ││ └────────────────────────────────┘└─────────────────────────┘│
└──────────┴──────────────────────────────────────────────────────────────┘
```

## Components used

- `<AppShell>` / `<SideNav>` / `<TopBar>` ⬜ — frame (active = Reservations)
- `<Btn>` ✅ — add booking / auto-fill actions
- `<Grid>` ✅ — KPI strip + 2-up panels
- `<KPI>` ✅ — booked / walk-ins / no-show risk / open slots
- `<Panel>` ✅ — funnel, channel, waitlist, cohort containers
- `<ConversionFunnel>` ✅ — widget→confirmed stages with biggest-leak callout
- `<Donut>` ✅ — channel attribution with legend + centered total
- `<MiniTable>` ✅ — waitlist rows with `<Pill>` ✅ status tags
- `<CohortGrid>` ✅ — 30/60/90-day repeat-booking retention
