'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/apiClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2, FolderKanban } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Project {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  owner: {
    id: string;
    email: string;
    fullName: string | null;
  };
  _count: {
    tasks: number;
    tags: number;
  };
}

interface ProjectsTableProps {
  onUpdate: () => void;
}

export function ProjectsTable({ onUpdate }: ProjectsTableProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterUserId, setFilterUserId] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, [filterUserId]);

  const fetchProjects = async () => {
    try {
      const url = filterUserId
        ? `/api/admin/projects?userId=${filterUserId}`
        : `/api/admin/projects`;

      const data = await apiClient.get<Project[]>(url);
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los proyectos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('¿Estás seguro de eliminar este proyecto? Todas las tareas asociadas también serán eliminadas.')) {
      return;
    }

    try {
      await apiClient.delete(`/api/admin/projects/${projectId}`);
      toast({
        title: 'Éxito',
        description: 'Proyecto eliminado correctamente',
      });
      fetchProjects();
      onUpdate();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el proyecto',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderKanban className="h-5 w-5" />
          Proyectos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Proyecto</TableHead>
                <TableHead>Propietario</TableHead>
                <TableHead className="text-right">Tareas</TableHead>
                <TableHead className="text-right">Etiquetas</TableHead>
                <TableHead>Fecha Creación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No hay proyectos registrados
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-mono text-xs">
                      {project.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{project.owner.fullName || 'Sin nombre'}</div>
                        <div className="text-xs text-muted-foreground">{project.owner.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">{project._count.tasks}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">{project._count.tags}</Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(project.createdAt), 'dd MMM yyyy', { locale: es })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(project.id)}
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}