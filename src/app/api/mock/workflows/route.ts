// ⚠️ MOCK ENDPOINT — GET /api/mock/workflows
// The mock data for the Workflows page lives here and ONLY here. The page and
// its hook consume this shape and react to it; swap this body for a real
// backend and nothing downstream changes. Route handlers are uncached by
// default, so each request re-runs this handler.
import type { MockEnvelope } from '@/lib/api/client';
import type { WorkflowsData } from '@/types/workflows';

export async function GET() {
  const data: WorkflowsData = {
    name: 'Weekend review responder',
    active: false,
    prompt:
      'When a 4★+ review comes in, draft a thank-you and send it if confidence > 85%.',
    aiTokens: [
      'Generated ',
      '6 ',
      'nodes: ',
      'a ',
      'review ',
      'trigger ',
      '→ ',
      'AI ',
      'draft ',
      '→ ',
      'a ',
      'confidence ',
      'gate. ',
      'High-confidence ',
      'replies ',
      'send ',
      'automatically; ',
      'the ',
      'rest ',
      'pause ',
      'for ',
      'your ',
      'approval.',
    ],
    palette: [
      {
        id: 'pal-trigger',
        label: 'Trigger',
        hint: 'Starts the run',
        icon: 'Zap',
        tag: 'event',
        tagTone: 'info',
      },
      {
        id: 'pal-ai',
        label: 'AI draft',
        hint: 'Generate text',
        icon: 'Sparkles',
        tag: 'AI',
        tagTone: 'brand',
      },
      {
        id: 'pal-condition',
        label: 'Condition',
        hint: 'Branch on a rule',
        icon: 'GitBranch',
        tag: 'logic',
        tagTone: 'primary',
      },
      {
        id: 'pal-approval',
        label: 'Approval',
        hint: 'Pause for sign-off',
        icon: 'ShieldCheck',
        tag: 'gate',
        tagTone: 'warning',
      },
      {
        id: 'pal-send',
        label: 'Send',
        hint: 'Deliver the reply',
        icon: 'SendHorizontal',
        tag: 'action',
        tagTone: 'success',
      },
      {
        id: 'pal-wait',
        label: 'Wait',
        hint: 'Delay the run',
        icon: 'Clock',
        tag: 'timer',
        tagTone: 'neutral',
      },
    ],
    nodes: [
      {
        id: 'n-trigger',
        kind: 'trigger',
        title: 'New review',
        detail: 'Google · rating ≥ 4★',
        tag: 'event',
        tagTone: 'info',
      },
      {
        id: 'n-ai',
        kind: 'ai',
        title: 'AI draft',
        detail: 'Warm thank-you in your brand voice',
        tag: 'AI',
        tagTone: 'brand',
      },
      {
        id: 'n-condition',
        kind: 'condition',
        title: 'Condition',
        detail: 'confidence > 85%',
        tag: 'logic',
        tagTone: 'primary',
      },
      {
        id: 'n-send',
        kind: 'send',
        title: 'Send reply',
        detail: 'Auto-publish high-confidence drafts',
        tag: 'action',
        tagTone: 'success',
      },
      {
        id: 'n-approval',
        kind: 'approval',
        title: 'Approval gate',
        detail: 'Low-confidence drafts pause for your sign-off',
        tag: 'gate',
        tagTone: 'warning',
        approvalDraft:
          "Hi Jordan, thanks so much for the kind words — it means a lot to the whole team. We'd love to have you back soon!",
      },
    ],
    edges: [
      { id: 'e1', from: 'n-trigger', to: 'n-ai' },
      { id: 'e2', from: 'n-ai', to: 'n-condition' },
      { id: 'e3', from: 'n-condition', to: 'n-send', label: 'pass' },
      { id: 'e4', from: 'n-condition', to: 'n-approval', label: 'fail' },
    ],
  };

  const body: MockEnvelope<WorkflowsData> = {
    mock: true,
    generatedAt: new Date().toISOString(),
    data,
  };
  return Response.json(body);
}
