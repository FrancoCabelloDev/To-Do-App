'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SortableTaskCard } from './SortableTaskCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { Task, TaskStatus } from '@/types/api';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onReorder?: (taskId: string, newOrder: number) => void;
}

export function TaskList({ tasks, loading, onEdit, onDelete, onReorder }: TaskListProps) {
  const [filter, setFilter] = useState<TaskStatus | 'ALL'>('ALL');
  const [localTasks, setLocalTasks] = useState(tasks);
  const [isDragging, setIsDragging] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Actualizar localTasks solo cuando el array de tareas cambie de longitud o contenido
  useEffect(() => {
    if (!isDragging && !isReordering && !loading) {
      // Comparar por IDs para detectar cambios reales
      const currentIds = localTasks.map(t => t.id).sort().join(',');
      const newIds = tasks.map(t => t.id).sort().join(',');
      
      if (currentIds !== newIds || tasks.length !== localTasks.length) {
        setLocalTasks(tasks);
      }
    }
  }, [tasks, isDragging, isReordering, loading]);

  const filteredTasks =
    filter === 'ALL' ? localTasks : localTasks.filter((task) => task.status === filter);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = filteredTasks.findIndex((task) => task.id === active.id);
      const newIndex = filteredTasks.findIndex((task) => task.id === over.id);

      if (oldIndex === -1 || newIndex === -1) {
        setIsDragging(false);
        return;
      }

      setIsReordering(true);

      // Reordenar solo las tareas filtradas
      const reorderedFilteredTasks = arrayMove(filteredTasks, oldIndex, newIndex);
      
      // Si estamos en ALL, reordenamos todo localTasks directamente
      if (filter === 'ALL') {
        const updatedTasks = reorderedFilteredTasks.map((task, index) => ({
          ...task,
          displayOrder: index
        }));
        setLocalTasks(updatedTasks);
        
        // Notificar al backend
        if (onReorder) {
          onReorder(active.id as string, newIndex);
          // Mantener isReordering hasta que el backend termine
          setTimeout(() => setIsReordering(false), 1000);
        }
      } else {
        // Si hay filtro, solo actualizamos las tareas del filtro
        const newOrderMap = new Map(reorderedFilteredTasks.map((task, idx) => [task.id, idx]));
        
        const updatedTasks = localTasks.map(task => {
          const newOrder = newOrderMap.get(task.id);
          if (newOrder !== undefined) {
            return { ...task, displayOrder: newOrder };
          }
          return task;
        });
        
        setLocalTasks(updatedTasks);

        // Notificar al backend con el nuevo displayOrder
        if (onReorder) {
          onReorder(active.id as string, newIndex);
          // Mantener isReordering hasta que el backend termine
          setTimeout(() => setIsReordering(false), 1000);
        }
      }
    }
    
    setIsDragging(false);
  };

  return (
    <div className="space-y-4">
      <Tabs value={filter} onValueChange={(v) => setFilter(v as TaskStatus | 'ALL')}>
        <TabsList>
          <TabsTrigger value="ALL">All</TabsTrigger>
          <TabsTrigger value="TODO">To Do</TabsTrigger>
          <TabsTrigger value="IN_PROGRESS">In Progress</TabsTrigger>
          <TabsTrigger value="DONE">Done</TabsTrigger>
        </TabsList>
      </Tabs>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredTasks.map(t => t.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {loading ? (
              <>
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </>
            ) : filteredTasks.length === 0 ? (
              <div className="col-span-full flex h-64 items-center justify-center">
                <p className="text-muted-foreground">
                  No tasks found. Create your first task to get started.
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <SortableTaskCard
                  key={task.id}
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
