# Vendors — outreach + lead board

A kanban board (leads → contacted → quoted → signed). Each card holds vendor
info, ratings, and a point of contact; AI drafts cold emails and call tips on
demand. A scraping workflow surfaces potential vendors. Ref: SID-89.

```
┌──────────┬──────────────────────────────────────────────────────────────┐
│ <SideNav>│ <TopBar>  Vendors    Category: Dairy ▾    [<Btn>+ Add vendor]  │
│ Vendors ●│├──────────────────────────────────────────────────────────────┤
│          ││ <KanbanBoard>  (<DragDropProvider>)                          │
│          ││ ┌ Leads ──────┐┌ Contacted ──┐┌ Quoted ────┐┌ Signed ──────┐ │
│          ││ │<Dropzone>   ││<Dropzone>   ││<Dropzone>  ││<Dropzone>    │ │
│          ││ │┌⋮⋮ <Card>──┐││┌⋮⋮ <Card>──┐││┌⋮⋮ <Card>─┐││┌⋮⋮ <Card>───┐│ │
│          ││ ││Burrata Co.│││Valley Farm│││Hill Dairy│││Coast Cream  ││ │
│          ││ ││★★★★☆ 4.2  │││★★★★★ 4.8  │││$5.10/lb  │││<Pill succ>✓ ││ │
│          ││ ││<Pill>new  │││POC: Sam   │││<Pill warn>│││ signed      ││ │
│          ││ ││[✦ Draft   │││[✦ Call    │││ pending  │││ POC: Dana   ││ │
│          ││ ││  email]   │││  tips]    ││└──────────┘│└─────────────┘│ │
│          ││ │└───────────┘││└───────────┘│┌⋮⋮ <Card>─┐│              │ │
│          ││ │┌⋮⋮ <Card>──┐││             ││Town Co-op│ drag cards    │ │
│          ││ ││Fresh Bros │││             ││$4.95/lb  │ across lanes  │ │
│          ││ │└───────────┘││             │└──────────┘│              │ │
│          ││ └─────────────┘└─────────────┘└────────────┘└──────────────┘ │
│          ││                                                              │
│          ││ ┌ <Dialog> Cold-email draft (AI) ──────────────────────────┐ │
│          ││ │ <AIReplyDraft> "Hi Sam, we run a 90-seat bistro and…"    │ │
│          ││ │ [<Pill brand>AI]   <ApprovalBar> [Reject][Edit][Send]   │ │
│          ││ └──────────────────────────────────────────────────────────┘ │
└──────────┴──────────────────────────────────────────────────────────────┘
```

## Components used

- `<AppShell>` / `<SideNav>` / `<TopBar>` ⬜ — frame (active = Vendors)
- `<KanbanBoard>` ⬜ — 4-lane board, composed from dnd primitives
- `<DragDropProvider>` + `<Dropzone>` + `<Draggable>` ✅ — lanes as dropzones, cards drag across (`⋮⋮`)
- `<Card>` ✅ — vendor cards (rating, price, POC)
- `<Pill>` ✅ — lead status (new / pending / signed) tags
- `<Dialog>` ⬜ — cold-email composer modal
- `<AIReplyDraft>` ✅ — generated cold email with `<Pill>` ✅ confidence + `<ApprovalBar>` ✅
- `<Btn>` ✅ — add vendor / draft email / call tips
