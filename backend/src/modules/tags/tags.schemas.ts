import { z } from 'zod';

export const createTagBodySchema = z.object({
  projectId: z.string().uuid(),
  name: z.string().min(1, 'Name is required').max(50),
  color: z.string().max(20).optional(),
});

export const createTagSchema = {
  body: createTagBodySchema,
};

export const tagIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const tagIdSchema = {
  params: tagIdParamsSchema,
};

export const tagQueryParamsSchema = z.object({
  projectId: z.string().uuid().optional(),
});

export const tagQuerySchema = {
  query: tagQueryParamsSchema,
};

export const updateTagBodySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50).optional(),
  color: z.string().max(20).optional(),
});

export const updateTagSchema = {
  params: tagIdParamsSchema,
  body: updateTagBodySchema,
};

export type CreateTagDto = z.infer<typeof createTagBodySchema>;
export type UpdateTagDto = z.infer<typeof updateTagBodySchema>;
