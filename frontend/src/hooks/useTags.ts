import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';

interface Tag {
  id: string;
  name: string;
  color: string;
  projectId: string;
}

export function useTags(projectId?: string) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchTags = async () => {
    if (!projectId) return;
    
    try {
      setLoading(true);
      const data = await apiClient.get<Tag[]>(`/api/tags?projectId=${projectId}`);
      setTags(data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchTags();
    }
  }, [projectId]);

  const createTag = async (data: { projectId: string; name: string; color: string }) => {
    try {
      const newTag = await apiClient.post<Tag>('/api/tags', data);
      setTags(prev => [...prev, newTag]);
      toast({
        title: 'Success',
        description: 'Tag created successfully',
      });
      return newTag;
    } catch (error) {
      console.error('Error creating tag:', error);
      toast({
        title: 'Error',
        description: 'Failed to create tag',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateTag = async (tagId: string, data: { name?: string; color?: string }) => {
    try {
      const updatedTag = await apiClient.patch<Tag>(`/api/tags/${tagId}`, data);
      setTags(prev => prev.map(tag => tag.id === tagId ? updatedTag : tag));
      toast({
        title: 'Success',
        description: 'Tag updated successfully',
      });
      return updatedTag;
    } catch (error) {
      console.error('Error updating tag:', error);
      toast({
        title: 'Error',
        description: 'Failed to update tag',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteTag = async (tagId: string) => {
    try {
      await apiClient.delete(`/api/tags/${tagId}`);
      setTags(prev => prev.filter(tag => tag.id !== tagId));
      toast({
        title: 'Success',
        description: 'Tag deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete tag',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return {
    tags,
    loading,
    createTag,
    updateTag,
    deleteTag,
    refetch: fetchTags,
  };
}
