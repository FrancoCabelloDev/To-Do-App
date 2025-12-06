import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { authorizeRole } from '../middleware/authorize.js';

const router = Router();

// All admin routes require authentication and ADMIN role
router.use(requireAuth);
router.use(authorizeRole(['ADMIN']));

// Statistics
router.get('/stats', adminController.getStats);

// Users management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Tasks management
router.get('/tasks', adminController.getAllTasks);
router.delete('/tasks/:id', adminController.deleteTask);

// Projects management
router.get('/projects', adminController.getAllProjects);
router.delete('/projects/:id', adminController.deleteProject);

export default router;
