'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/apiClient';
import type { Project, CreateProjectDto, UpdateProjectDto } from '@/types/api';
import { toast } from 'sonner';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.get<Project[]>('/api/projects');
      setProjects(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch projects';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = async (data: CreateProjectDto) => {
    try {
      const newProject = await apiClient.post<Project>('/api/projects', data);
      // Actualizar inmediatamente para UX instantánea
      setProjects((prev) => [newProject, ...prev]);
      toast.success('Project created successfully');
      return newProject;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create project';
      toast.error(message);
      throw err;
    }
  };

  const updateProject = async (id: string, data: UpdateProjectDto) => {
    try {
      const updated = await apiClient.patch<Project>(`/api/projects/${id}`, data);
      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
      toast.success('Project updated successfully');
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update project';
      toast.error(message);
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await apiClient.delete(`/api/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success('Project deleted successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete project';
      toast.error(message);
      throw err;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}
