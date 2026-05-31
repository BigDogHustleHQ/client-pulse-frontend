# Today — the morning dashboard

The page an owner opens first thing. A drag-rearrangeable workspace: shortcuts
shelf, KPI tile grid, AI action tiles, goals panel, and an AI "glance" summary.
Ref: SID-77.

```
┌──────────┬──────────────────────────────────────────────────────────────┐
│ <SideNav>│ <TopBar>  [Avatar] Bella's Bistro ▾   ⌕ search    🔔[Badge 3] │
│  ● Today │├──────────────────────────────────────────────────────────────┤
│  Inbox   ││ <PanelHead> Good morning, Maria ☕   <StatusDot ●pulse "live">│
│  Social  ││                                                              │
│  Reserv. ││ <Inline> Shortcuts shelf ───────────────────────────────────│
│  Workflo.││  [<Btn>+ New post] [<Btn>+ Reservation] [<Btn variant=ghost> │
│  Vendors ││   Ask AI] [<Btn variant=ghost> Generate site]                │
│  Website ││                                                              │
│  Insights││ <Grid cols=4>  KPI tile grid   (<Draggable> ⋮⋮ reorder)      │
│  Settings││  ┌⋮⋮ <KPI>───┐┌⋮⋮ <KPI>───┐┌⋮⋮ <KPI>───┐┌⋮⋮ <KPI>──────┐     │
│          ││  │Covers 142 ││Revenue $4k││Reviews 12 ││No-show 3%    │     │
│          ││  │▲ +12%     ││▲ +8%      ││▲ +3 new   ││▼ -2% (good ✓)│     │
│          ││  └───────────┘└───────────┘└───────────┘└──────────────┘     │
│          ││                                                              │
│          ││ <Grid cols=2>                                               │
│          ││  ┌ <Panel> AI action tiles ───────┐┌ <Panel> Today's goals ┐│
│          ││  │ <AIReplyDraft>                  ││ <DragDropProvider>    ││
│          ││  │  ✦ 2 reviews need a reply       ││ ⋮⋮ Hit 150 covers     ││
│          ││  │  [Pill success 94%] [Approve]   ││    <ProgressBar 142/150>││
│          ││  │ ─────────────────────────────── ││ ⋮⋮ Reply to all DMs    ││
│          ││  │ ✦ Slow Tuesday — promo draft?   ││    <ProgressBar 3/8>   ││
│          ││  │  [<Btn>Review draft]            ││ ⋮⋮ Post 3x this week   ││
│          ││  └─────────────────────────────────┘└───────────────────────┘│
│          ││                                                              │
│          ││ ┌ <Panel> Glance summary  (AI narrative, Inngest cron) ─────┐│
│          ││ │ "You're tracking 8% ahead of last Tuesday. Dinner is      ││
│          ││ │  nearly full; lunch has 12 open slots — consider a        ││
│          ││ │  midday promo. 2 reviews and 3 DMs are awaiting reply."   ││
│          ││ └───────────────────────────────────────────────────────────┘│
└──────────┴──────────────────────────────────────────────────────────────┘
```

## Components used

- `<AppShell>` ⬜ — sidebar + topbar frame
- `<SideNav>` ⬜ — left nav rail (active = Today)
- `<TopBar>` ⬜ — tenant switcher, search, notifications
- `<Avatar>` ⬜ — tenant/user badge · `<Badge>` ✅ — unread notification count
- `<PanelHead>` ✅ — greeting header · `<StatusDot>` ✅ — live indicator (pulsing)
- `<Inline>` ✅ — shortcuts shelf row · `<Btn>` ✅ — shortcut actions
- `<Grid>` ✅ — KPI + panel layout
- `<KPI>` ✅ — the four metric tiles (delta colored good/bad)
- `<DragDropProvider>` + `<Draggable>` ✅ — reorderable KPI tiles and goals (`⋮⋮` grip)
- `<Panel>` ✅ — AI actions, goals, glance summary containers
- `<AIReplyDraft>` ✅ — surfaced review/DM drafts with confidence `<Pill>` + `<ApprovalBar>`
- `<ProgressBar>` ✅ — goal completion bars
