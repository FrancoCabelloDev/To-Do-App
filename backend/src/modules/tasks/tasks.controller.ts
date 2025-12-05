import { Request, Response, NextFunction } from 'express';
import { TasksService } from './tasks.service.js';

const tasksService = new TasksService();

export class TasksController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.query;
      const tasks = await tasksService.getAllTasks(
        req.user.id,
        req.user.role,
        projectId as string | undefined
      );
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const task = await tasksService.getTaskById(req.params.id, req.user.id, req.user.role);
      res.json(task);
    } catch (error) {
      if ((error as Error).message === 'Forbidden') {
        res.status(403).json({ error: 'Forbidden' });
        return;
      }
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const task = await tasksService.createTask(req.body, req.user.id, req.user.id, req.user.role);
      res.status(201).json(task);
    } catch (error) {
      if ((error as Error).message === 'Forbidden') {
        res.status(403).json({ error: 'Forbidden' });
        return;
      }
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const task = await tasksService.updateTask(
        req.params.id,
        req.body,
        req.user.id,
        req.user.role
      );
      res.json(task);
    } catch (error) {
      if ((error as Error).message === 'Forbidden') {
        res.status(403).json({ error: 'Forbidden' });
        return;
      }
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await tasksService.deleteTask(req.params.id, req.user.id, req.user.role);
      res.status(204).send();
    } catch (error) {
      if ((error as Error).message === 'Forbidden') {
        res.status(403).json({ error: 'Forbidden' });
        return;
      }
      next(error);
    }
  }
}
