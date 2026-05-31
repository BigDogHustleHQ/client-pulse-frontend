/** Tone passed straight to <Pill> for a palette node's tag. */
export type WorkflowPillTone =
  | 'neutral'
  | 'brand'
  | 'primary'
  | 'info'
  | 'warning'
  | 'success';

/** A draggable node type shown in the left palette. */
export type WorkflowPaletteNode = {
  id: string;
  label: string;
  /** Short descriptor of what the node does. */
  hint: string;
  /** lucide-react icon name used to look up the glyph in the page. */
  icon: string;
  /** Tag rendered as a <Pill> next to the node label. */
  tag: string;
  tagTone: WorkflowPillTone;
};

/** The kind of node placed on the builder canvas. */
export type WorkflowNodeKind =
  | 'trigger'
  | 'ai'
  | 'condition'
  | 'approval'
  | 'send'
  | 'wait';

/** A node positioned on the builder canvas (rendered as a card). */
export type WorkflowNode = {
  id: string;
  kind: WorkflowNodeKind;
  title: string;
  /** Supporting line shown under the title. */
  detail: string;
  tag?: string;
  tagTone?: WorkflowPillTone;
  /** Draft awaiting sign-off — present only on the approval-gate node. */
  approvalDraft?: string;
};

/** A directed edge connecting two canvas nodes (rendered as an SVG line). */
export type WorkflowEdge = {
  id: string;
  from: string;
  to: string;
  /** Optional label rendered next to the connector (e.g. a branch name). */
  label?: string;
};

export type WorkflowsData = {
  /** Name of the workflow being edited. */
  name: string;
  /** Whether the workflow is currently live. */
  active: boolean;
  /** Seeds the chat composer prompt. */
  prompt: string;
  /** Canned tokens the mock AI streams when the prompt is generated. */
  aiTokens: string[];
  /** Draggable node types in the left palette. */
  palette: WorkflowPaletteNode[];
  /** Nodes on the builder canvas, ordered top-to-bottom. */
  nodes: WorkflowNode[];
  /** Connectors between canvas nodes. */
  edges: WorkflowEdge[];
};
