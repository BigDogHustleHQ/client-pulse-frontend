'use client';

import * as React from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { Pencil, Plus, RotateCcw } from 'lucide-react';
import { Btn } from '@/components/primitives';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { WidgetCatalog } from './types';
import { useWidgetLayout } from './use-widget-layout';
import { WidgetFrame } from './widget-frame';
import type { WidgetInstance } from './types';

export type WidgetBoardProps<TData> = {
  /** Persistence + storage key, e.g. `today` → `cp:widgets:today`. */
  page: string;
  /** Available widget types for this page. */
  catalog: WidgetCatalog<TData>;
  /** Seeded layout used on first load / reset. */
  defaultLayout: () => WidgetInstance[];
  /** Page data passed to each widget's `render`. */
  data: TData;
  /** Accessible label for the board's edit toolbar region. */
  title?: string;
  className?: string;
};

/**
 * A user-configurable grid of widgets with add / remove / drag-reorder, an
 * Edit-layout toggle, and localStorage persistence. dnd-kit is wired directly
 * (no shared dnd components) with pointer + keyboard sensors.
 */
export function WidgetBoard<TData>({
  page,
  catalog,
  defaultLayout,
  data,
  title = 'Dashboard',
  className,
}: WidgetBoardProps<TData>) {
  const { layout, addWidget, removeWidget, reorder, reset } =
    useWidgetLayout<TData>(page, catalog, defaultLayout);
  const [editing, setEditing] = React.useState(false);

  const byType = React.useMemo(
    () => new Map(catalog.map((c) => [c.type, c])),
    [catalog],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorder(String(active.id), String(over.id));
    }
  }

  const ids = layout.map((w) => w.id);

  return (
    <section
      data-slot="widget-board"
      aria-label={`${title} widgets`}
      className={cn('flex flex-col gap-4', className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-heading text-base font-medium text-muted-foreground">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          {editing && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Btn variant="secondary" size="sm" data-slot="add-widget">
                    <Plus />
                    Add widget
                  </Btn>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64"
                  data-slot="add-widget-menu"
                >
                  <DropdownMenuLabel>Add a widget</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {catalog.map((entry) => {
                    const Icon = entry.icon;
                    return (
                      <DropdownMenuItem
                        key={entry.type}
                        data-slot="add-widget-option"
                        data-widget-type={entry.type}
                        onSelect={() => addWidget(entry.type)}
                      >
                        <Icon className="text-muted-foreground" />
                        <span className="flex flex-col">
                          <span className="font-medium">{entry.label}</span>
                          {entry.description && (
                            <span className="text-xs text-muted-foreground">
                              {entry.description}
                            </span>
                          )}
                        </span>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
              <Btn
                variant="ghost"
                size="sm"
                data-slot="reset-layout"
                onClick={reset}
              >
                <RotateCcw />
                Reset
              </Btn>
            </>
          )}
          <Btn
            variant={editing ? 'default' : 'secondary'}
            size="sm"
            data-slot="edit-layout-toggle"
            aria-pressed={editing}
            onClick={() => setEditing((e) => !e)}
          >
            <Pencil />
            {editing ? 'Done' : 'Edit layout'}
          </Btn>
        </div>
      </div>

      {layout.length === 0 ? (
        <p
          data-slot="widget-board-empty"
          className="rounded-xl bg-secondary px-4 py-8 text-center text-sm text-muted-foreground"
        >
          No widgets yet.{' '}
          {editing
            ? 'Use “Add widget” to get started.'
            : 'Tap “Edit layout” to add widgets.'}
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={ids} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {layout.map((instance) => {
                const entry = byType.get(instance.type);
                if (!entry) return null;
                return (
                  <WidgetFrame
                    key={instance.id}
                    id={instance.id}
                    size={entry.defaultSize}
                    label={entry.label}
                    editing={editing}
                    onRemove={() => removeWidget(instance.id)}
                  >
                    {entry.render(data)}
                  </WidgetFrame>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </section>
  );
}
