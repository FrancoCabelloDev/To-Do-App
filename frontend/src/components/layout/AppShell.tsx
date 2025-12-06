'use client';

import { useState } from 'react';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import type { Project } from '@/types/api';

interface AppShellProps {
  children: React.ReactNode;
  selectedProjectId: string | null;
  onSelectProject: (id: string | null) => void;
  onNewProject: () => void;
  projects: Project[];
  projectsLoading: boolean;
}

export function AppShell({
  children,
  selectedProjectId,
  onSelectProject,
  onNewProject,
  projects,
  projectsLoading,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col">
      <Topbar onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          selectedProjectId={selectedProjectId}
          onSelectProject={onSelectProject}
          onNewProject={onNewProject}
          projects={projects}
          loading={projectsLoading}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 overflow-auto flex justify-center">
          <div className="w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
