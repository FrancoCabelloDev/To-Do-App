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
    <Card className={`hover:shadow-md transition-shadow ${priorityColors[task.priority]} border-l-4 h-full`}>
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-semibold text-base flex-1 line-clamp-2">{task.title}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 shrink-0"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
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

        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{task.description}</p>
        )}

        <div className="flex flex-wrap gap-1.5 mb-3">
          <Badge variant="secondary" className={`text-xs ${statusColors[task.status]} text-white`}>
            {task.status.replace('_', ' ')}
          </Badge>
          <Badge variant="outline" className="text-xs">{task.priority}</Badge>
          
          {task.tags && task.tags.length > 0 && task.tags.map(({ tag }) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="text-xs border"
              style={{
                backgroundColor: (tag.color || '#6B7280') + '20',
                borderColor: tag.color || '#6B7280',
                color: tag.color || '#6B7280',
              }}
            >
              {tag.name}
            </Badge>
          ))}
        </div>

        <div className="mt-auto space-y-2">
          {task.dueAt && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>{format(new Date(task.dueAt), 'MMM dd, yyyy')}</span>
            </div>
          )}
          {task.assignedTo && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              <span>{task.assignedTo.fullName || task.assignedTo.email}</span>
            </div>
          )}
          <div className="text-xs text-muted-foreground truncate">
            {task.project.name}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
