import { Router } from 'express';
import { TasksController } from './tasks.controller.js';
import { requireAuth } from '../../middlewares/requireAuth.js';
import { validate } from '../../middlewares/validate.js';
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
  taskQuerySchema,
} from './tasks.schemas.js';

const router = Router();
const tasksController = new TasksController();

router.post(
  '/',
  requireAuth,
  validate(createTaskSchema),
  tasksController.create.bind(tasksController)
);

router.get(
  '/',
  requireAuth,
  validate(taskQuerySchema),
  tasksController.getAll.bind(tasksController)
);

router.get(
  '/:id',
  requireAuth,
  validate(taskIdSchema),
  tasksController.getById.bind(tasksController)
);

router.patch(
  '/:id',
  requireAuth,
  validate(updateTaskSchema),
  tasksController.update.bind(tasksController)
);

router.delete(
  '/:id',
  requireAuth,
  validate(taskIdSchema),
  tasksController.delete.bind(tasksController)
);

export default router;
