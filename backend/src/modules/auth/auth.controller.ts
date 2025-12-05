import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';

const authService = new AuthService();

export class AuthController {
  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await authService.getMe(req.user.id);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  }

  async syncProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Missing authorization header' });
        return;
      }

      const token = authHeader.substring(7);
      const profile = await authService.syncProfile(token);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  }
}
