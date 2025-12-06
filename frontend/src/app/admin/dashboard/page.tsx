'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/apiClient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UsersTable } from '@/components/admin/UsersTable';
import { TasksTable } from '@/components/admin/TasksTable';
import { ProjectsTable } from '@/components/admin/ProjectsTable';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { Topbar } from '@/components/layout/Topbar';
import { Users, FolderKanban, CheckSquare, UserCheck, Clock } from 'lucide-react';

interface Stats {
  users: {
    total: number;
    admins: number;
    clients: number;
  };
  projects: {
    total: number;
  };
  tasks: {
    total: number;
    completed: number;
    pending: number;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await apiClient.get<Stats>('/api/admin/stats');
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminRoute>
      <div className="flex h-screen flex-col">
        <Topbar />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto py-6 px-4 space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Panel de Administración</h1>
              <p className="text-muted-foreground">Gestiona usuarios, proyectos y tareas</p>
            </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.users.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.users.admins} admins, {stats.users.clients} clientes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Proyectos</CardTitle>
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.projects.total}</div>
              <p className="text-xs text-muted-foreground">Total de proyectos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Tareas</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.tasks.total}</div>
              <p className="text-xs text-muted-foreground">Todas las tareas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completadas</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.tasks.completed}</div>
              <p className="text-xs text-muted-foreground">
                {stats.tasks.total > 0 
                  ? Math.round((stats.tasks.completed / stats.tasks.total) * 100)
                  : 0}% del total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.tasks.pending}</div>
              <p className="text-xs text-muted-foreground">
                {stats.tasks.total > 0
                  ? Math.round((stats.tasks.pending / stats.tasks.total) * 100)
                  : 0}% del total
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Data Tables */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="projects">Proyectos</TabsTrigger>
          <TabsTrigger value="tasks">Tareas</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <UsersTable onUpdate={fetchStats} />
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <ProjectsTable onUpdate={fetchStats} />
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <TasksTable onUpdate={fetchStats} />
        </TabsContent>
      </Tabs>
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}
