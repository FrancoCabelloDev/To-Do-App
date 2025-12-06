import { Request, Response, NextFunction } from 'express';
import { TagsService } from './tags.service.js';

const tagsService = new TagsService();

export class TagsController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.query;
      const tags = await tagsService.getAllTags(
        req.user.id,
        req.user.role,
        projectId as string | undefined
      );
      res.json(tags);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tag = await tagsService.createTag(req.body, req.user.id, req.user.role);
      res.status(201).json(tag);
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
      const tag = await tagsService.updateTag(req.params.id, req.body, req.user.id, req.user.role);
      res.json(tag);
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
      await tagsService.deleteTag(req.params.id, req.user.id, req.user.role);
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
