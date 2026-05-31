# Website Builder — 5 questions, 3 variations

The demo-stopper. Three modes (AI-generated default, Templates, Drag-build).
Mode A: answer five questions, AI generates three full-site variations side by
side; pick one, refine, or "Generate 3 more". Publishes in ~30s. Ref: SID-90.

```
┌──────────┬──────────────────────────────────────────────────────────────┐
│ <SideNav>│ <TopBar>  Website Builder        <Tabs>[AI][Templates][Build] │
│ Website ●│├──────────────────────────────────────────────────────────────┤
│          ││ ┌ <Panel> 5 questions ──────────┐  <ProgressBar 4/5>         │
│          ││ │ 1 Business name?   ✓           │                           │
│          ││ │ 2 Vibe?  <Chip>cozy <Chip>rustic                          │
│          ││ │ 3 Signature dish?  ✓           │                           │
│          ││ │ 4 Colors?  ●●●○ (palette)      │                           │
│          ││ │ 5 Call to action? [<Input>____]│                           │
│          ││ │             [<Btn loading>Generate 3 variations]          │
│          ││ └────────────────────────────────┘                           │
│          ││                                                              │
│          ││ <Grid cols=3>  Variations (<SitePreview> each, in <Card>)    │
│          ││ ┌ <Card> ───────┐┌ <Card> ───────┐┌ <Card> ───────┐         │
│          ││ │▓▓ hero ▓▓▓▓▓▓ ││▓▓ hero ▓▓▓▓▓▓ ││▓▓ hero ▓▓▓▓▓▓ │         │
│          ││ │  Bella's       ││  BELLA'S      ││  bella's      │         │
│          ││ │ ░ menu ░ ░ ░  ││ ░ menu ░ ░ ░  ││ ░ menu ░ ░ ░  │         │
│          ││ │ [Book] [Map]  ││ [Reserve]     ││ [Order]       │         │
│          ││ │<Pill brand>A  ││<Pill>B        ││<Pill>C        │         │
│          ││ │ [Pick] [↻]    ││ [Pick] [↻]    ││ [Pick] [↻]    │         │
│          ││ └───────────────┘└───────────────┘└───────────────┘         │
│          ││ [<Btn variant=ghost>Generate 3 more]   Publish → bella.vendrr.app│
└──────────┴──────────────────────────────────────────────────────────────┘
```

## Components used

- `<AppShell>` / `<SideNav>` / `<TopBar>` ⬜ — frame (active = Website)
- `<Tabs>` ⬜ — mode switch (AI / Templates / Drag-build)
- `<Panel>` ✅ — the 5-question wizard
- `<ProgressBar>` ✅ — question progress (4/5)
- `<Chip>` ✅ — vibe selections · `<Input>` ✅ — free-text answers
- `<Btn>` ✅ — generate (uses `loading` state) / pick / regenerate / publish
- `<Grid>` ✅ — 3-up variation layout
- `<Card>` ✅ — each variation frame · `<SitePreview>` ⬜ — rendered site thumbnail
- `<Pill>` ✅ — variation labels (A/B/C)
