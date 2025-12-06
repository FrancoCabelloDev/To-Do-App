'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { AppShell } from '@/components/layout/AppShell';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskDialog } from '@/components/tasks/TaskDialog';
import { ProjectDialog } from '@/components/projects/ProjectDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { Task, CreateTaskDto, UpdateTaskDto, CreateProjectDto } from '@/types/api';

export default function DashboardPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { projects, loading: projectsLoading, createProject } = useProjects();
  const { tasks, loading: tasksLoading, createTask, updateTask, updateTasksBatch, deleteTask, refetch } = useTasks(
    selectedProjectId || undefined
  );

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
    // Redirigir admins a su dashboard específico
    if (!authLoading && profile?.role === 'ADMIN') {
      router.push('/admin/dashboard');
    }
  }, [user, profile, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleCreateTask = async (data: CreateTaskDto) => {
    await createTask(data);
  };

  const handleUpdateTask = async (data: UpdateTaskDto) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
      setEditingTask(null);
    }
  };

  const handleTaskSubmit = async (data: CreateTaskDto | UpdateTaskDto) => {
    if (editingTask) {
      await handleUpdateTask(data as UpdateTaskDto);
    } else {
      await handleCreateTask(data as CreateTaskDto);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskDialogOpen(true);
  };

  const handleDeleteTask = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
    }
  };

  const handleReorderTask = async (taskId: string, newDisplayOrder: number) => {
    try {
      // Obtener todas las tareas actuales
      const allTasks = [...tasks];
      
      // Encontrar la tarea que se movió
      const taskIndex = allTasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return;
      
      // Remover la tarea de su posición actual
      const [movedTask] = allTasks.splice(taskIndex, 1);
      
      // Insertarla en la nueva posición
      allTasks.splice(newDisplayOrder, 0, movedTask);
      
      // Preparar actualizaciones en batch para todas las tareas
      const updates = allTasks.map((task, index) => ({
        id: task.id,
        data: { displayOrder: index }
      }));
      
      // Actualizar todas las tareas en una sola operación y esperar
      await updateTasksBatch(updates);
      
      // Pequeño delay adicional para asegurar que el estado se propague
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Failed to reorder task:', error);
      // Si falla, refrescar para restaurar el orden correcto
      await refetch();
    }
  };

  const handleCreateProject = async (data: CreateProjectDto) => {
    await createProject(data);
  };

  return (
    <AppShell
      selectedProjectId={selectedProjectId}
      onSelectProject={setSelectedProjectId}
      onNewProject={() => setProjectDialogOpen(true)}
      projects={projects}
      projectsLoading={loading}
    >
      <div className="w-full p-4 md:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">
              {selectedProjectId
                ? projects.find((p) => p.id === selectedProjectId)?.name || 'Tasks'
                : 'All Tasks'}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Manage your tasks and stay organized
            </p>
          </div>
          <Button onClick={() => setTaskDialogOpen(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            <span className="sm:inline">New Task</span>
          </Button>
        </div>

        <TaskList
          tasks={tasks}
          loading={tasksLoading}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onReorder={handleReorderTask}
        />
      </div>

      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={(open) => {
          setTaskDialogOpen(open);
          if (!open) setEditingTask(null);
        }}
        task={editingTask}
        projectId={selectedProjectId || undefined}
        projects={projects.map((p) => ({ id: p.id, name: p.name }))}
        onSubmit={handleTaskSubmit}
      />

      <ProjectDialog
        open={projectDialogOpen}
        onOpenChange={setProjectDialogOpen}
        onSubmit={handleCreateProject}
      />
    </AppShell>
  );
}
