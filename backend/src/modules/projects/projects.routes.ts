import { Router } from 'express';
import { ProjectsController } from './projects.controller.js';
import { requireAuth } from '../../middlewares/requireAuth.js';
import { validate } from '../../middlewares/validate.js';
import {
  createProjectSchema,
  updateProjectSchema,
  projectIdSchema,
} from './projects.schemas.js';

const router = Router();
const projectsController = new ProjectsController();

router.post(
  '/',
  requireAuth,
  validate(createProjectSchema),
  projectsController.create.bind(projectsController)
);

router.get('/', requireAuth, projectsController.getAll.bind(projectsController));

router.get(
  '/:id',
  requireAuth,
  validate(projectIdSchema),
  projectsController.getById.bind(projectsController)
);

router.patch(
  '/:id',
  requireAuth,
  validate(updateProjectSchema),
  projectsController.update.bind(projectsController)
);

router.delete(
  '/:id',
  requireAuth,
  validate(projectIdSchema),
  projectsController.delete.bind(projectsController)
);

export default router;
