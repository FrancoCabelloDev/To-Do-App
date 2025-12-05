import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { requireAuth } from '../../middlewares/requireAuth.js';

const router = Router();
const authController = new AuthController();

router.get('/me', requireAuth, authController.getMe.bind(authController));
router.post('/sync', requireAuth, authController.syncProfile.bind(authController));

export default router;
