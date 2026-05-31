# Component Legend

Master vocabulary for the ASCII page mocks in this folder. Every component
referenced in a mock (e.g. `<KPI>`, `<ConversionFunnel>`) is defined here once.
Each page file repeats only the subset it uses.

**Status key:** ✅ built in the component library · ⬜ still to build

## Primitives — `@/components/primitives` (SID-69)

| Component                         | Status | What it is                                                     |
| --------------------------------- | ------ | -------------------------------------------------------------- |
| `<Panel>` / `<PanelHead>`         | ✅     | Card container with an optional titled header + actions slot   |
| `<KPI>`                           | ✅     | Labeled metric: big value + trend delta (▲/▼) colored good/bad |
| `<Pill>`                          | ✅     | Small status tag (neutral/brand/success/warning/danger/info)   |
| `<Badge>`                         | ✅     | Count/notification badge (`12`, `99+`)                         |
| `<StatusDot>`                     | ✅     | Colored dot (online/busy/offline…), optional pulse + label     |
| `<Chip>`                          | ✅     | Removable tag with optional leading icon                       |
| `<Btn>`                           | ✅     | Button (shadcn) with a `loading` spinner state                 |
| `<ProgressBar>`                   | ✅     | Labeled progress/usage bar with tone                           |
| `<MiniTable>`                     | ✅     | Compact column/row table with empty state                      |
| `<Stack>` / `<Inline>` / `<Grid>` | ✅     | Layout helpers (vertical / horizontal / grid)                  |

## Charts — `@/components/charts` (SID-74)

| Component            | Status | What it is                                           |
| -------------------- | ------ | ---------------------------------------------------- |
| `<ConversionFunnel>` | ✅     | Stage bars with % of first + step-to-step conversion |
| `<Donut>`            | ✅     | Donut chart with legend + centered total             |
| `<Heatmap>`          | ✅     | 2D intensity grid (e.g. day × hour)                  |
| `<CohortGrid>`       | ✅     | Retention grid (cohort rows × period cols)           |
| `<Sparkline>`        | ✅     | Tiny inline trend line/area                          |

## Drag & drop — `@/components/dnd` (SID-73)

| Component            | Status | What it is                                   |
| -------------------- | ------ | -------------------------------------------- |
| `<DragDropProvider>` | ✅     | dnd-kit context (pointer + keyboard sensors) |
| `<Draggable>`        | ✅     | Sortable/movable item (shows `⋮⋮` grip)      |
| `<Dropzone>`         | ✅     | Droppable target with dashed hover hint      |
| `<DragHandle>`       | ✅     | The `⋮⋮` grip button                         |

## AI surfaces — `@/components/ai` (SID-75)

| Component          | Status | What it is                                            |
| ------------------ | ------ | ----------------------------------------------------- |
| `<ChatComposer>`   | ✅     | Prompt box that streams an AI response                |
| `<ApprovalBar>`    | ✅     | Approve / Edit / Reject sign-off bar                  |
| `<ToneSlider>`     | ✅     | Professional ↔ Casual tone selector                   |
| `<AIReplyDraft>`   | ✅     | AI draft + confidence pill + embedded `<ApprovalBar>` |
| `<MockAIProvider>` | ✅     | Test/story AI backend                                 |

## shadcn/ui — `@/components/ui`

| Component                                            | Status | What it is             |
| ---------------------------------------------------- | ------ | ---------------------- |
| `<Button>` `<Input>` `<Label>` `<Checkbox>` `<Card>` | ✅     | Base form/layout atoms |

## App shell & page-specific — to build (⬜)

| Component              | Status | What it is                                                 |
| ---------------------- | ------ | ---------------------------------------------------------- |
| `<AppShell>`           | ⬜     | Sidebar + topbar frame wrapping every page                 |
| `<SideNav>`            | ⬜     | Left nav rail with the 9 page links                        |
| `<TopBar>`             | ⬜     | Header: tenant switcher, search, notifications, avatar     |
| `<Avatar>`             | ⬜     | User/tenant image badge                                    |
| `<Tabs>`               | ⬜     | Tabbed section switcher                                    |
| `<Dialog>` / `<Sheet>` | ⬜     | Modal / slide-over                                         |
| `<Calendar>`           | ⬜     | Weekly time-grid (Social Studio)                           |
| `<KanbanBoard>`        | ⬜     | Lane board built on `<Dropzone>` + `<Draggable>` (Vendors) |
| `<WorkflowCanvas>`     | ⬜     | Node/edge builder stage (Workflows)                        |
| `<IntegrationCard>`    | ⬜     | Connect/status/revoke tile (Settings)                      |
| `<SitePreview>`        | ⬜     | Rendered website variation frame (Website Builder)         |
