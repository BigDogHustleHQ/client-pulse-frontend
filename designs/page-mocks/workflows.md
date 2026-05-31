# Workflows — chat to canvas

The defining abstraction: workflows connect tools and automate tasks. Node
palette on the left, builder canvas in the middle (SVG edges), chat composer
on top — describe it, AI generates the graph, edit, activate. Ref: SID-84.

```
┌──────────┬──────────────────────────────────────────────────────────────┐
│ <SideNav>│ <TopBar> Workflows  "Weekend review responder" ▾  [<Btn>Activate]│
│ Workflo.●│├──────────────────────────────────────────────────────────────┤
│          ││ ┌ <ChatComposer> ─────────────────────────────────────────┐  │
│          ││ │ ✦ "When a 4★+ review comes in, draft a thank-you and     │  │
│          ││ │    send it if confidence > 85%"            [Generate ▶]  │  │
│          ││ └──────────────────────────────────────────────────────────┘  │
│          │├───────────────┬──────────────────────────────────────────────┤
│          ││ Node palette  │ <WorkflowCanvas>  (<DragDropProvider>)        │
│          ││ <Stack>       │                                              │
│          ││ ⋮⋮ Trigger    │   ┌─[Trigger]─┐                              │
│          ││ ⋮⋮ AI draft   │   │ New review│                              │
│          ││ ⋮⋮ Condition  │   └─────┬─────┘   ← SVG edge                 │
│          ││ ⋮⋮ Approval   │     ┌───▼────┐                               │
│          ││ ⋮⋮ Send       │     │AI draft│  <Pill brand>AI               │
│          ││ ⋮⋮ Wait       │     └───┬────┘                               │
│          ││               │   ┌─────▼──────┐                            │
│          ││ drag a node → │   │ Condition  │ conf > 85%                 │
│          ││ <Draggable>   │   └──┬──────┬──┘                            │
│          ││ onto canvas   │   ┌──▼──┐ ┌─▼─────────┐                     │
│          ││ <Dropzone>    │   │Send │ │<ApprovalBar>│ (gate node)        │
│          ││               │   └─────┘ └───────────┘                     │
│          ││               │  [+ node] · drag to connect · ⋮⋮ reposition  │
└──────────┴───────────────┴──────────────────────────────────────────────┘
```

## Components used

- `<AppShell>` / `<SideNav>` / `<TopBar>` ⬜ — frame (active = Workflows)
- `<ChatComposer>` ✅ — describe the workflow → AI generates the graph
- `<WorkflowCanvas>` ⬜ — node/edge builder stage (SVG edges, free-positioned)
- `<DragDropProvider>` + `<Draggable>` + `<Dropzone>` ✅ — drag nodes from palette onto the canvas, reposition (`⋮⋮`)
- `<Stack>` ✅ — node palette list
- `<Pill>` ✅ — node-type tags (AI / trigger / condition)
- `<ApprovalBar>` ✅ — the approval-gate node surface (pauses the run)
- `<Btn>` ✅ — Activate / Generate
