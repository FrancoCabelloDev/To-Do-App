import { z } from 'zod';
import { TaskStatus, TaskPriority } from '@prisma/client';

export const createTaskBodySchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().min(1, 'Title is required').max(500),
  description: z.string().max(2000).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  dueAt: z.string().datetime().optional(),
  assignedToId: z.string().uuid().optional().nullable(),
  tagIds: z.array(z.string().uuid()).optional(),
});

export const createTaskSchema = {
  body: createTaskBodySchema,
};

export const taskIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const updateTaskBodySchema = z.object({
  title: z.string().min(1).max(500).optional(),
  description: z.string().max(2000).optional().nullable(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  dueAt: z.string().datetime().optional().nullable(),
  assignedToId: z.string().uuid().optional().nullable(),
  tagIds: z.array(z.string().uuid()).optional(),
});

export const updateTaskSchema = {
  params: taskIdParamsSchema,
  body: updateTaskBodySchema,
};

export const taskIdSchema = {
  params: taskIdParamsSchema,
};

export const taskQueryParamsSchema = z.object({
  projectId: z.string().uuid().optional(),
});

export const taskQuerySchema = {
  query: taskQueryParamsSchema,
};

export type CreateTaskDto = z.infer<typeof createTaskBodySchema>;
export type UpdateTaskDto = z.infer<typeof updateTaskBodySchema>;
