# Social Studio — calendar + AI variations

Weekly Morning/Afternoon/Evening × Mon→Sun drag-drop calendar of post cards,
with AI-suggested cells, a platform priority rail, and workflow badges.
Ref: SID-78.

```
┌──────────┬──────────────────────────────────────────────────────────────┐
│ <SideNav>│ <TopBar>  Social Studio    Week of Jun 2 ▾   [<Btn>+ New post] │
│ Social ● │├────────────────────────────────────────────────┬─────────────┤
│          ││ <Calendar> drag-drop grid (<DragDropProvider>)  │ Priority    │
│          ││        Mon    Tue    Wed    Thu    Fri          │ rail        │
│          ││ Morn ┌────┐┌────┐┌╌╌╌╌┐┌────┐┌────┐             │ <Stack>     │
│          ││      │⋮⋮IG ││⋮⋮FB ││ +AI ││⋮⋮IG ││    │  ← <Dropzone>│ <Pill>IG  ││
│          ││      │post ││post ││sugg.││post ││    │             │ <Pill>FB  ││
│          ││      └────┘└────┘└╌╌╌╌┘└────┘└────┘             │ <Pill>TikTok││
│          ││ Aft  ┌────┐┌╌╌╌╌┐┌────┐┌────┐┌╌╌╌╌┐             │             │
│          ││      │⋮⋮TT ││ +AI ││⋮⋮IG ││⋮⋮FB ││ +AI│             │ Drag a      │
│          ││      │[wf]●││sugg.││post ││post ││sugg│             │ platform    │
│          ││      └────┘└╌╌╌╌┘└────┘└────┘└╌╌╌╌┘             │ onto a cell │
│          ││ Eve  ┌────┐┌────┐┌────┐┌╌╌╌╌┐┌────┐             │             │
│          ││      │⋮⋮IG ││⋮⋮IG ││⋮⋮FB ││ +AI ││⋮⋮TT│             │             │
│          ││      └────┘└────┘└────┘└╌╌╌╌┘└────┘             │             │
│          │├─────────────────────────────────────────────────┴─────────────┤
│          ││ ┌ <Panel> Selected post — Tue Morning ─────────────────────┐  │
│          ││ │ <ChatComposer> "make this more playful" ✦                │  │
│          ││ │ <Grid cols=3> AI variations:  [v1][v2][v3]  (<Card> each) │  │
│          ││ │ [wf]● = <Badge> workflow attached   <ApprovalBar>        │  │
│          ││ └──────────────────────────────────────────────────────────┘  │
└──────────┴──────────────────────────────────────────────────────────────┘
```

Legend: `┌────┐` scheduled post card · `┌╌╌╌╌┐` AI-suggested empty cell ·
`⋮⋮` draggable grip · `[wf]●` workflow badge.

## Components used

- `<AppShell>` / `<SideNav>` / `<TopBar>` ⬜ — frame (active = Social)
- `<Calendar>` ⬜ — weekly time-grid (slots × days), built on dnd primitives
- `<DragDropProvider>` + `<Draggable>` + `<Dropzone>` ✅ — drag posts/platforms into cells (dashed `╌` = drop hint)
- `<Card>` ✅ — post cards and the 3 AI variations
- `<Badge>` ✅ — workflow-attached marker on a card
- `<Pill>` ✅ — platform tags in the priority rail · `<Stack>` ✅ — rail layout
- `<Panel>` ✅ — selected-post editor
- `<ChatComposer>` ✅ — "make this more playful" → streams new copy
- `<ApprovalBar>` ✅ — approve/edit/reject the chosen variation
- `<Btn>` ✅ — new post
