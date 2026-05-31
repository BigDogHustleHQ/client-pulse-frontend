'use client';

import * as React from 'react';
import type { WidgetCatalog, WidgetInstance } from './types';

/** localStorage key for a page's saved widget layout. */
function storageKey(page: string): string {
  return `cp:widgets:${page}`;
}

let instanceCounter = 0;
/** A unique-enough instance id (layouts are per-browser, single-user mock). */
function makeInstanceId(type: string): string {
  instanceCounter += 1;
  return `${type}-${Date.now().toString(36)}-${instanceCounter}`;
}

function readStored(page: string): WidgetInstance[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(storageKey(page));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const valid = parsed.filter(
      (w): w is WidgetInstance =>
        typeof w?.id === 'string' && typeof w?.type === 'string',
    );
    return valid.length > 0 ? valid : null;
  } catch {
    return null;
  }
}

function writeStored(page: string, layout: WidgetInstance[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey(page), JSON.stringify(layout));
  } catch {
    // Ignore quota / privacy-mode write failures — layout stays in memory.
  }
}

export type UseWidgetLayout = {
  layout: WidgetInstance[];
  /** Catalog entries not yet known so the board can drop stale instances. */
  addWidget: (type: string) => void;
  removeWidget: (id: string) => void;
  reorder: (fromId: string, toId: string) => void;
  /** Restore the seeded defaults. */
  reset: () => void;
  /** Whether the layout has finished hydrating from localStorage. */
  ready: boolean;
};

/**
 * Manages the ordered list of widget instances for a single page, persisted to
 * localStorage under `cp:widgets:<page>`. On first load it seeds `defaults`.
 * Stale instances whose `type` is no longer in the catalog are dropped.
 */
export function useWidgetLayout<TData>(
  page: string,
  catalog: WidgetCatalog<TData>,
  defaults: () => WidgetInstance[],
): UseWidgetLayout {
  const [layout, setLayout] = React.useState<WidgetInstance[]>([]);
  const [ready, setReady] = React.useState(false);
  const defaultsRef = React.useRef(defaults);
  React.useEffect(() => {
    defaultsRef.current = defaults;
  });

  const knownTypes = React.useMemo(
    () => new Set(catalog.map((c) => c.type)),
    [catalog],
  );

  // Hydrate once on mount (client only). Falls back to seeded defaults.
  React.useEffect(() => {
    const stored = readStored(page);
    const next = (stored ?? defaultsRef.current()).filter((w) =>
      knownTypes.has(w.type),
    );
    setLayout(next);
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Persist on every change after hydration.
  React.useEffect(() => {
    if (ready) writeStored(page, layout);
  }, [page, layout, ready]);

  const addWidget = React.useCallback((type: string) => {
    setLayout((prev) => [...prev, { id: makeInstanceId(type), type }]);
  }, []);

  const removeWidget = React.useCallback((id: string) => {
    setLayout((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const reorder = React.useCallback((fromId: string, toId: string) => {
    setLayout((prev) => {
      const from = prev.findIndex((w) => w.id === fromId);
      const to = prev.findIndex((w) => w.id === toId);
      if (from === -1 || to === -1 || from === to) return prev;
      const next = prev.slice();
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }, []);

  const reset = React.useCallback(() => {
    setLayout(defaultsRef.current().filter((w) => knownTypes.has(w.type)));
  }, [knownTypes]);

  return { layout, addWidget, removeWidget, reorder, reset, ready };
}

export { storageKey as widgetStorageKey, makeInstanceId };
