# Inbox — drafts + confidence thresholds

Unified inbox across Google/Yelp reviews, Instagram DMs, SMS, and email. Each
message gets an AI-drafted reply with a tone slider and an approval bar. The
confidence threshold is the universal AI-safety primitive. Ref: SID-79.

```
┌──────────┬──────────────────────────────────────────────────────────────┐
│ <SideNav>│ <TopBar>  Inbox        ⌕ search        Threshold ⚙ (admin)    │
│  Inbox ● │├───────────────┬──────────────────────────────────────────────┤
│          ││ Channels      │ Thread                                       │
│          ││ <MiniTable>   │ ┌ <PanelHead> ★★★★☆ Google review ───────────┐│
│          ││  All     [42] │ │ [Avatar] Jordan P.   <Pill info>Google     ││
│          ││  Google  [12] │ │ "Great food but slow service on Friday."   ││
│          ││  Yelp     [5] │ └────────────────────────────────────────────┘│
│          ││  IG DMs   [9] │                                              │
│          ││  SMS     [11] │ ┌ <AIReplyDraft> ──────────────────────────┐ │
│          ││  Email    [5] │ │ ✦ AI-drafted reply   [<Pill warning 78%>]│ │
│          ││               │ │ ┌────────────────────────────────────────┐│ │
│          ││ each row =    │ │ │"Hi Jordan, thanks for the kind words — ││ │
│          ││ <Pill> tone + │ │ │ sorry about Friday's wait. We've added ││ │
│          ││ <Badge> count │ │ │ staff for weekends. Hope to see you!"  ││ │
│          ││               │ │ └────────────────────────────────────────┘│ │
│          ││               │ │ <ToneSlider> Professional ●──────○ Casual │ │
│          ││               │ │ <ApprovalBar> [✕ Reject][✎ Edit][✓ Approve]│ │
│          ││               │ └──────────────────────────────────────────┘ │
│          ││               │                                              │
│          ││               │ <Panel> ⚠ Below 80% threshold → owner review │
│          ││               │ (above threshold + channel allows → auto-send)│
└──────────┴───────────────┴──────────────────────────────────────────────┘
```

## Components used

- `<AppShell>` / `<SideNav>` / `<TopBar>` ⬜ — frame (active = Inbox)
- `<MiniTable>` ✅ — channel list with per-channel `<Badge>` ✅ counts and `<Pill>` ✅ tags
- `<Avatar>` ⬜ — sender image
- `<PanelHead>` ✅ — message header (rating + source `<Pill>`)
- `<AIReplyDraft>` ✅ — the draft surface, composing:
  - `<Pill>` ✅ — confidence indicator (success/warning/danger by threshold)
  - `<ToneSlider>` ✅ — adjust reply tone, regenerates draft
  - `<ApprovalBar>` ✅ — Reject / Edit / Approve callbacks
- `<Panel>` ✅ — threshold explainer
- Threshold settings ⚙ are an admin overlay (per-channel confidence sliders)
