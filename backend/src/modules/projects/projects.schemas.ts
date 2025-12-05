import { z } from 'zod';

export const createProjectBodySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().max(1000).optional(),
});

export const createProjectSchema = {
  body: createProjectBodySchema,
};

export const updateProjectParamsSchema = z.object({
  id: z.string().uuid(),
});

export const updateProjectBodySchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional().nullable(),
  archivedAt: z.string().datetime().optional().nullable(),
});

export const updateProjectSchema = {
  params: updateProjectParamsSchema,
  body: updateProjectBodySchema,
};

export const projectIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const projectIdSchema = {
  params: projectIdParamsSchema,
};

export type CreateProjectDto = z.infer<typeof createProjectBodySchema>;
export type UpdateProjectDto = z.infer<typeof updateProjectBodySchema>;
