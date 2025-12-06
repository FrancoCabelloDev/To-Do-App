'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Pencil, Trash2, Calendar, User } from 'lucide-react';
import type { Task } from '@/types/api';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const statusColors = {
  TODO: 'bg-slate-500',
  IN_PROGRESS: 'bg-blue-500',
  DONE: 'bg-green-500',
  CANCELED: 'bg-red-500',
};

const priorityColors = {
  LOW: 'border-slate-300',
  MEDIUM: 'border-yellow-500',
  HIGH: 'border-orange-500',
  URGENT: 'border-red-500',
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <Card className={`border-l-4 ${priorityColors[task.priority]}`}>
      <CardContent className="p-3 md:p-4">
        <div className="flex items-start justify-between gap-2 md:gap-4">
          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-sm md:text-base wrap-break-word">{task.title}</h3>
              <Badge variant="secondary" className={`text-xs ${statusColors[task.status]}`}>
                {task.status.replace('_', ' ')}
              </Badge>
              <Badge variant="outline" className="text-xs">{task.priority}</Badge>
            </div>

            {task.description && (
              <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{task.description}</p>
            )}

            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              {task.dueAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(task.dueAt), 'MMM dd, yyyy')}
                </div>
              )}
              {task.assignedTo && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {task.assignedTo.fullName || task.assignedTo.email}
                </div>
              )}
              <div className="flex items-center gap-1">
                Project: {task.project.name}
              </div>
            </div>

            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.tags.map(({ tag }) => (
                  <Badge key={tag.id} variant="outline" className="text-xs">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(task.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
