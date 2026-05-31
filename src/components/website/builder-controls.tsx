'use client';

import { Eye, EyeOff } from 'lucide-react';
import { Stack } from '@/components/primitives';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type {
  WebsiteConfig,
  WebsiteFontPair,
  WebsitePalette,
  WebsiteSectionId,
} from '@/types/website';

const SECTION_LABELS: Record<WebsiteSectionId, string> = {
  hero: 'Hero',
  about: 'About',
  menu: 'Menu',
  hours: 'Hours',
  gallery: 'Gallery',
  reviews: 'Reviews',
  contact: 'Contact',
};

const SECTION_ORDER: WebsiteSectionId[] = [
  'hero',
  'about',
  'menu',
  'hours',
  'gallery',
  'reviews',
  'contact',
];

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

/**
 * The editable controls that drive the live preview. Every change is lifted to
 * the parent via `onChange` (merged into the current config), so the preview
 * re-renders immediately.
 */
export function BuilderControls({
  config,
  palettes,
  fontPairs,
  onChange,
}: {
  config: WebsiteConfig;
  palettes: WebsitePalette[];
  fontPairs: WebsiteFontPair[];
  onChange: (patch: Partial<WebsiteConfig>) => void;
}) {
  function toggleSection(id: WebsiteSectionId) {
    onChange({ sections: { ...config.sections, [id]: !config.sections[id] } });
  }

  return (
    <Stack gap="md" data-slot="builder-controls">
      <Field label="Brand name" htmlFor="bc-brand">
        <Input
          id="bc-brand"
          value={config.brandName}
          autoComplete="off"
          onChange={(e) => onChange({ brandName: e.target.value })}
        />
      </Field>

      <Field label="Tagline" htmlFor="bc-tagline">
        <Input
          id="bc-tagline"
          value={config.tagline}
          autoComplete="off"
          onChange={(e) => onChange({ tagline: e.target.value })}
        />
      </Field>

      <Field label="Hero button text" htmlFor="bc-cta">
        <Input
          id="bc-cta"
          value={config.heroCta}
          autoComplete="off"
          onChange={(e) => onChange({ heroCta: e.target.value })}
        />
      </Field>

      <div className="flex flex-col gap-1.5">
        <Label>Theme palette</Label>
        <div
          role="radiogroup"
          aria-label="Theme palette"
          className="grid grid-cols-2 gap-2"
        >
          {palettes.map((p) => {
            const selected = p.id === config.paletteId;
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={selected}
                data-palette={p.id}
                onClick={() =>
                  onChange({ paletteId: p.id, accentColor: p.accent })
                }
                className={cn(
                  'flex items-center gap-2 rounded-lg border p-2 text-left text-sm transition-colors motion-reduce:transition-none',
                  selected
                    ? 'border-foreground/30 bg-secondary ring-1 ring-foreground/10'
                    : 'border-border hover:bg-muted',
                )}
              >
                <span
                  aria-hidden="true"
                  className="size-6 shrink-0 rounded-md ring-1 ring-foreground/10"
                  style={{
                    background: `linear-gradient(135deg, ${p.accent} 50%, ${p.surface} 50%)`,
                  }}
                />
                <span className="truncate font-medium">{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-end gap-3">
        <Field label="Accent color" htmlFor="bc-accent">
          <input
            id="bc-accent"
            type="color"
            value={config.accentColor}
            aria-label="Accent color"
            onChange={(e) => onChange({ accentColor: e.target.value })}
            className="h-8 w-14 cursor-pointer rounded-lg border border-input bg-transparent p-0.5"
          />
        </Field>
        <span className="pb-1.5 font-mono text-xs text-muted-foreground">
          {config.accentColor}
        </span>
      </div>

      <Field label="Font pairing" htmlFor="bc-font">
        <select
          id="bc-font"
          value={config.fontPairId}
          onChange={(e) => onChange({ fontPairId: e.target.value })}
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {fontPairs.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
      </Field>

      <div className="flex flex-col gap-1.5">
        <Label>Sections</Label>
        <div className="flex flex-wrap gap-2">
          {SECTION_ORDER.map((id) => {
            const on = config.sections[id];
            return (
              <button
                key={id}
                type="button"
                aria-pressed={on}
                data-section={id}
                onClick={() => toggleSection(id)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-sm transition-colors motion-reduce:transition-none',
                  on
                    ? 'border-brand/40 bg-brand/10 text-brand'
                    : 'border-border bg-secondary text-muted-foreground hover:text-foreground',
                )}
              >
                {on ? (
                  <Eye className="size-3.5" />
                ) : (
                  <EyeOff className="size-3.5" />
                )}
                {SECTION_LABELS[id]}
              </button>
            );
          })}
        </div>
      </div>
    </Stack>
  );
}
