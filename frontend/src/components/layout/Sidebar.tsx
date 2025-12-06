'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Folder, CheckSquare, Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import type { Project } from '@/types/api';

interface SidebarProps {
  selectedProjectId: string | null;
  onSelectProject: (id: string | null) => void;
  onNewProject: () => void;
  projects: Project[];
  loading: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ selectedProjectId, onSelectProject, onNewProject, projects, loading, isOpen = true, onClose }: SidebarProps) {
  const router = useRouter();

  const handleAllTasksClick = () => {
    onSelectProject(null);
    onClose?.();
    router.push('/dashboard');
  };

  const handleProjectClick = (projectId: string) => {
    onSelectProject(projectId);
    onClose?.();
    router.push(`/dashboard?project=${projectId}`);
  };

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 border-r bg-background transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex h-full flex-col`}
      >
        <div className="p-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleAllTasksClick}
          >
            <CheckSquare className="mr-2 h-4 w-4" />
            All Tasks
        </Button>
      </div>

      <Separator />

      <div className="flex-1 overflow-auto p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-muted-foreground">Projects</h3>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onNewProject}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-1">
          {loading ? (
            <>
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </>
          ) : projects.length === 0 ? (
            <p className="text-sm text-muted-foreground">No projects yet</p>
          ) : (
            projects.map((project) => (
              <Button
                key={project.id}
                variant={selectedProjectId === project.id ? 'secondary' : 'ghost'}
                className={cn('w-full justify-start', selectedProjectId === project.id && 'bg-secondary')}
                onClick={() => handleProjectClick(project.id)}
              >
                <Folder className="mr-2 h-4 w-4" />
                <span className="truncate">{project.name}</span>
                {project._count && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    {project._count.tasks}
                  </span>
                )}
              </Button>
            ))
          )}
        </div>
      </div>
    </aside>
    </>
  );
}
