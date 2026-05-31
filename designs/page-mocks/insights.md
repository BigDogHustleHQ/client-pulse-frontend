# Insights — Opus-grade reasoning

Summarizes business performance: pros/cons, goal progress, competitive pricing,
customer growth, drop-off points. Opus 4.7 does cross-module synthesis and
recommendations; Sonnet 4.6 handles lighter summaries. Ref: SID-91.

```
┌──────────┬──────────────────────────────────────────────────────────────┐
│ <SideNav>│ <TopBar>  Insights      Period: Last 30 days ▾   [↻ Refresh]  │
│ Insights●│├──────────────────────────────────────────────────────────────┤
│          ││ ┌ <Panel> Executive summary (Opus 4.7) ────────────────────┐ │
│          ││ │ ✦ "Revenue is up 11% MoM, driven by dinner covers.       │ │
│          ││ │   Your no-show rate beats the local median. Watch lunch  │ │
│          ││ │   traffic — down 6% and trailing two nearby competitors."│ │
│          ││ │ <Inline> [<Pill succ>3 strengths] [<Pill warn>2 risks]   │ │
│          ││ └──────────────────────────────────────────────────────────┘ │
│          ││ <Grid cols=2>                                               │
│          ││ ┌ <Panel> Customer growth ──────┐┌ <Panel> Pros & cons ────┐│
│          ││ │ <Sparkline> ╱╲╱╲___╱‾‾        ││ ✓ Strong repeat rate    ││
│          ││ │ New 312  Repeat 58%           ││ ✓ High review score     ││
│          ││ │ <KPI>LTV $214  ▲ +9%          ││ ✗ Lunch underperforming ││
│          ││ └────────────────────────────────┘│ ✗ Slow Friday service  ││
│          ││ ┌ <Panel> Competitive pricing ──┐│  (each = <Pill> tone)   ││
│          ││ │ <MiniTable>                    │└─────────────────────────┘│
│          ││ │  Item     You    Mkt   Δ       │┌ <Panel> Drop-off points ┐│
│          ││ │  Burrata  $14   $16  <Pill>-12%││ <ConversionFunnel>      ││
│          ││ │  Pasta    $22   $20  <Pill>+10%││ Site→Menu→Book→Confirm  ││
│          ││ │  Wine gl. $11   $13  <Pill>-15%││ ⚠ leak at Menu→Book     ││
│          ││ └────────────────────────────────┘└─────────────────────────┘│
│          ││ ┌ <Panel> Recommendations (Opus) ──────────────────────────┐ │
│          ││ │ 1. Launch a weekday lunch promo  [<Btn>Create workflow]  │ │
│          ││ │ 2. Nudge 86 lapsed regulars      [<Btn>Draft campaign]   │ │
│          ││ └──────────────────────────────────────────────────────────┘ │
└──────────┴──────────────────────────────────────────────────────────────┘
```

## Components used

- `<AppShell>` / `<SideNav>` / `<TopBar>` ⬜ — frame (active = Insights)
- `<Panel>` ✅ — summary, growth, pricing, pros/cons, drop-off, recommendations
- `<Inline>` ✅ — strengths/risks pill row · `<Pill>` ✅ — strength/risk + price-delta tags
- `<Sparkline>` ✅ — customer-growth trend
- `<KPI>` ✅ — LTV metric with delta
- `<MiniTable>` ✅ — competitive pricing table
- `<ConversionFunnel>` ✅ — drop-off points with leak callout
- `<Btn>` ✅ — turn a recommendation into a workflow/campaign
