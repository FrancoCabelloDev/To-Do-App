import { Router } from 'express';
import { TagsController } from './tags.controller.js';
import { requireAuth } from '../../middlewares/requireAuth.js';
import { validate } from '../../middlewares/validate.js';
import { createTagSchema, tagIdSchema, tagQuerySchema } from './tags.schemas.js';

const router = Router();
const tagsController = new TagsController();

router.post(
  '/',
  requireAuth,
  validate(createTagSchema),
  tagsController.create.bind(tagsController)
);

router.get('/', requireAuth, validate(tagQuerySchema), tagsController.getAll.bind(tagsController));

router.delete(
  '/:id',
  requireAuth,
  validate(tagIdSchema),
  tagsController.delete.bind(tagsController)
);

export default router;
