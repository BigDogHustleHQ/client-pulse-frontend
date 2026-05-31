# Settings — brand, integrations, budget

Integration grid (connect/status/revoke), brand profile (logo, palette, voice,
typography), budget tier selector, team members + roles, notification prefs.
Brand profile feeds the AI prompt layer so outputs sound like the business.
Ref: SID-85.

```
┌──────────┬──────────────────────────────────────────────────────────────┐
│ <SideNav>│ <TopBar>  Settings                                           │
│ Settings●│├───────────────┬──────────────────────────────────────────────┤
│          ││ <Tabs>(vert)  │ ── Integrations ──────────────────────────── │
│          ││ ● Integrations│ <Grid cols=3>  (<IntegrationCard> each)       │
│          ││   Brand       │ ┌ Google ───┐┌ Instagram ┐┌ OpenTable ─┐     │
│          ││   Budget      │ │<StatusDot●>││<StatusDot●>││<StatusDot○>│     │
│          ││   Team        │ │ Connected ││ Connected ││ Not linked │     │
│          ││   Notifs      │ │[Revoke]   ││[Revoke]   ││[<Btn>Connect]│   │
│          ││               │ └───────────┘└───────────┘└────────────┘     │
│          ││               │ ── Brand profile ──────────────────────────  │
│          ││               │ ┌ <Panel> ───────────────────────────────┐   │
│          ││               │ │ Logo [▣]  Palette ●●●●  Voice: warm,     │  │
│          ││               │ │ <ToneSlider> Formal ●────○ Playful       │  │
│          ││               │ │ Typography: Plus Jakarta Sans            │  │
│          ││               │ └──────────────────────────────────────────┘  │
│          ││               │ ── Budget tier ────────────────────────────  │
│          ││               │ <Grid cols=4> ( ) Starter ( ) Pro            │
│          ││               │   (●) Business ( ) Enterprise                │
│          ││               │ <ProgressBar> AI spend  $64 / $100 this mo.  │
│          ││               │ ── Team ───────────────────────────────────  │
│          ││               │ <MiniTable> Maria <Pill>Owner · Sam <Pill>Admin│
└──────────┴───────────────┴──────────────────────────────────────────────┘
```

## Components used

- `<AppShell>` / `<SideNav>` / `<TopBar>` ⬜ — frame (active = Settings)
- `<Tabs>` ⬜ — vertical section nav (Integrations / Brand / Budget / Team / Notifs)
- `<IntegrationCard>` ⬜ — connect/status/revoke tile, using `<StatusDot>` ✅ + `<Btn>` ✅
- `<Grid>` ✅ — integration grid + budget tier options
- `<Panel>` ✅ — brand profile block
- `<ToneSlider>` ✅ — brand voice (Formal ↔ Playful), feeds the prompt layer
- `<ProgressBar>` ✅ — monthly AI spend vs. tier budget
- `<MiniTable>` ✅ — team members with `<Pill>` ✅ role tags
- `<Checkbox>` ✅ — notification preferences (not shown)
