import { Router, Request, Response } from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';

const router = Router();

// Debug endpoint to check current user
router.get('/me', requireAuth, (req: Request, res: Response) => {
  res.json({
    user: req.user,
    message: 'Current authenticated user'
  });
});

export default router;
