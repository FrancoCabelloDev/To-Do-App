'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface User {
  id: string;
  email: string;
  fullName: string | null;
  role: 'ADMIN' | 'CLIENT';
  createdAt: string;
  _count: {
    projects: number;
    createdTasks: number;
    assignedTasks: number;
  };
}

interface UserDetailsDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailsDialog({ user, open, onOpenChange }: UserDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalles del Usuario</DialogTitle>
          <DialogDescription>Información completa del usuario</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 items-center">
            <span className="text-sm font-medium text-muted-foreground">ID:</span>
            <span className="text-xs col-span-2 font-mono">{user.id}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 items-center">
            <span className="text-sm font-medium text-muted-foreground">Email:</span>
            <span className="text-sm col-span-2">{user.email}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 items-center">
            <span className="text-sm font-medium text-muted-foreground">Nombre:</span>
            <span className="text-sm col-span-2">{user.fullName || '-'}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 items-center">
            <span className="text-sm font-medium text-muted-foreground">Rol:</span>
            <div className="col-span-2">
              <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                {user.role}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 items-center">
            <span className="text-sm font-medium text-muted-foreground">Registrado:</span>
            <span className="text-sm col-span-2">
              {format(new Date(user.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: es })}
            </span>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold mb-3">Estadísticas</h4>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Proyectos creados:</span>
                <Badge variant="outline">{user._count.projects}</Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tareas creadas:</span>
                <Badge variant="outline">{user._count.createdTasks}</Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tareas asignadas:</span>
                <Badge variant="outline">{user._count.assignedTasks}</Badge>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}