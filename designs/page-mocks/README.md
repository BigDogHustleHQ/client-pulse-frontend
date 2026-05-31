# Page mocks

ASCII wireframes for every page in the ClientPulse / Vendrr application. One
markdown file per page. Each mock tags its regions with the component that
renders them (`<KPI>`, `<ConversionFunnel>`, …) and lists those components below
the diagram, marked ✅ (already built in the component library) or ⬜ (to build).

Component definitions live in [`_component-legend.md`](./_component-legend.md).

## Pages

| Page | File | Linear | Signature components |
|---|---|---|---|
| Auth (Login / Register) | [auth.md](./auth.md) | built | Card, Input, Checkbox, Button |
| Today | [today.md](./today.md) | SID-77 | KPI, Draggable, AIReplyDraft, ProgressBar |
| Inbox | [inbox.md](./inbox.md) | SID-79 | AIReplyDraft, ToneSlider, ApprovalBar, MiniTable |
| Social Studio | [social-studio.md](./social-studio.md) | SID-78 | Calendar(dnd), Card, ChatComposer, Badge |
| Reservations | [reservations.md](./reservations.md) | SID-83 | KPI, ConversionFunnel, Donut, CohortGrid |
| Workflows | [workflows.md](./workflows.md) | SID-84 | ChatComposer, WorkflowCanvas(dnd), ApprovalBar |
| Vendors | [vendors.md](./vendors.md) | SID-89 | KanbanBoard(dnd), Card, AIReplyDraft |
| Website Builder | [website-builder.md](./website-builder.md) | SID-90 | Tabs, Card, ProgressBar, SitePreview |
| Insights | [insights.md](./insights.md) | SID-91 | Sparkline, MiniTable, ConversionFunnel, KPI |
| Settings | [settings.md](./settings.md) | SID-85 | IntegrationCard, ToneSlider, ProgressBar, MiniTable |

Every product page sits inside a shared `<AppShell>` (`<SideNav>` + `<TopBar>`),
and most have an admin overlay (tenant health, sync status, AI cost, error
logs) per SID-94.
