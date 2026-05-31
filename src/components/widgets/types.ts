import type * as React from 'react';
import type { LucideIcon } from 'lucide-react';

/** A logical column-span for a widget on the responsive board grid. */
export type WidgetSize = 'sm' | 'md' | 'lg';

/**
 * A catalog entry describes one *type* of widget. It is generic over the
 * page's data shape (`TData`) so its `render` receives exactly the data the
 * host page loaded from its mock endpoint. Catalogs are defined per page (see
 * `today/widget-catalog.tsx`, `insights/widget-catalog.tsx`) but share this
 * shape and the WidgetBoard that consumes them.
 */
export type WidgetCatalogEntry<TData> = {
  /** Stable type id, e.g. `kpi-covers`, `pros-cons`. */
  type: string;
  /** Human label shown in the Add-widget menu and as a fallback title. */
  label: string;
  /** Short description shown in the Add-widget menu. */
  description?: string;
  /** Menu/icon glyph. */
  icon: LucideIcon;
  /** Default column span when the widget is first added. */
  defaultSize: WidgetSize;
  /**
   * Render the widget body from the page's data. Returning `null` lets a
   * widget gracefully no-op if its backing data is missing.
   */
  render: (data: TData) => React.ReactNode;
};

/** A catalog is a list of entries keyed by `type`. */
export type WidgetCatalog<TData> = WidgetCatalogEntry<TData>[];

/**
 * A placed widget instance on a board. `id` is unique per instance (a type can
 * appear more than once); `type` references a catalog entry.
 */
export type WidgetInstance = {
  id: string;
  type: string;
};
