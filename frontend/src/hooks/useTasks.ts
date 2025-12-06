'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/apiClient';
import type { Task, CreateTaskDto, UpdateTaskDto } from '@/types/api';
import { toast } from 'sonner';

export function useTasks(projectId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const endpoint = projectId
        ? `/api/tasks?projectId=${projectId}`
        : '/api/tasks';
      const data = await apiClient.get<Task[]>(endpoint);
      setTasks(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const createTask = async (data: CreateTaskDto) => {
    try {
      const newTask = await apiClient.post<Task>('/api/tasks', data);
      setTasks((prev) => [newTask, ...prev]);
      toast.success('Task created successfully');
      return newTask;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create task';
      toast.error(message);
      throw err;
    }
  };

  const updateTask = async (id: string, data: UpdateTaskDto) => {
    try {
      const updated = await apiClient.patch<Task>(`/api/tasks/${id}`, data);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      toast.success('Task updated successfully');
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update task';
      toast.error(message);
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await apiClient.delete(`/api/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success('Task deleted successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete task';
      toast.error(message);
      throw err;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}
