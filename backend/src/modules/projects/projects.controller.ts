import { Request, Response, NextFunction } from 'express';
import { ProjectsService } from './projects.service.js';

const projectsService = new ProjectsService();

export class ProjectsController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const projects = await projectsService.getAllProjects(req.user.id, req.user.role);
      res.json(projects);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const project = await projectsService.getProjectById(
        req.params.id,
        req.user.id,
        req.user.role
      );
      res.json(project);
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
      const project = await projectsService.createProject(req.body, req.user.id);
      res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const project = await projectsService.updateProject(
        req.params.id,
        req.body,
        req.user.id,
        req.user.role
      );
      res.json(project);
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
      await projectsService.deleteProject(req.params.id, req.user.id, req.user.role);
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
