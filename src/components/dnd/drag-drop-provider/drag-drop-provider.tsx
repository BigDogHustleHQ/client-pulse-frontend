'use client';

import * as React from 'react';
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DndContextProps,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

// Global drag-and-drop context. Every draggable/droppable surface mounts
// inside this. Configures a PointerSensor (mouse/touch) and a KeyboardSensor
// wired with sortableKeyboardCoordinates for accessible keyboard reordering
// (space to lift, arrows to move, space to drop).
function DragDropProvider({
  children,
  sensors: sensorsProp,
  ...props
}: DndContextProps) {
  const defaultSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <DndContext sensors={sensorsProp ?? defaultSensors} {...props}>
      {children}
    </DndContext>
  );
}

export { DragDropProvider };
