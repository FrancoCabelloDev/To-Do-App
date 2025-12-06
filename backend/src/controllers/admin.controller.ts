import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const adminController = {
  // Get all users with stats
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await prisma.profile.findMany({
        select: {
          id: true,
          email: true,
          fullName: true,
          avatarUrl: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              projects: true,
              createdTasks: true,
              assignedTasks: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  },

  // Get user by ID with detailed stats
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const user = await prisma.profile.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              projects: true,
              createdTasks: true,
              assignedTasks: true,
            },
          },
        },
      });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  },

  // Update user
  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { email, fullName, role } = req.body;

      const user = await prisma.profile.update({
        where: { id },
        data: {
          ...(email && { email }),
          ...(fullName && { fullName }),
          ...(role && { role }),
        },
      });

      res.json(user);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  },

  // Delete user
  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Delete user's tasks first (cascade)
      await prisma.task.deleteMany({
        where: { createdById: id },
      });

      // Delete user's projects (cascade)
      await prisma.project.deleteMany({
        where: { ownerId: id },
      });

      // Delete user
      await prisma.profile.delete({
        where: { id },
      });

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  },

  // Get all tasks (admin view)
  async getAllTasks(req: Request, res: Response) {
    try {
      const { userId } = req.query;

      const tasks = await prisma.task.findMany({
        where: userId ? { createdById: userId as string } : undefined,
        include: {
          project: {
            select: {
              id: true,
              name: true,
              owner: {
                select: {
                  id: true,
                  email: true,
                  fullName: true,
                },
              },
            },
          },
          createdBy: {
            select: {
              id: true,
              email: true,
              fullName: true,
              avatarUrl: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              email: true,
              fullName: true,
              avatarUrl: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  },

  // Delete task (admin)
  async deleteTask(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.task.delete({
        where: { id },
      });

      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ error: 'Failed to delete task' });
    }
  },

  // Get all projects (admin view)
  async getAllProjects(req: Request, res: Response) {
    try {
      const { userId } = req.query;

      const projects = await prisma.project.findMany({
        where: userId ? { ownerId: userId as string } : undefined,
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              fullName: true,
              avatarUrl: true,
            },
          },
          _count: {
            select: {
              tasks: true,
              tags: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  },

  // Delete project (admin)
  async deleteProject(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Delete associated tasks first
      await prisma.task.deleteMany({
        where: { projectId: id },
      });

      // Delete project
      await prisma.project.delete({
        where: { id },
      });

      res.json({ message: 'Project deleted successfully' });
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ error: 'Failed to delete project' });
    }
  },

  // Get dashboard statistics
  async getStats(req: Request, res: Response) {
    try {
      // Usar queries agregadas más eficientes
      const [
        userStats,
        totalProjects,
        taskStats,
      ] = await Promise.all([
        prisma.profile.groupBy({
          by: ['role'],
          _count: true,
        }),
        prisma.project.count(),
        prisma.task.groupBy({
          by: ['status'],
          _count: true,
        }),
      ]);

      const totalUsers = userStats.reduce((sum, stat) => sum + stat._count, 0);
      const adminUsers = userStats.find(s => s.role === 'ADMIN')?._count || 0;
      const clientUsers = userStats.find(s => s.role === 'CLIENT')?._count || 0;
      
      const totalTasks = taskStats.reduce((sum, stat) => sum + stat._count, 0);
      const completedTasks = taskStats.find(s => s.status === 'DONE')?._count || 0;
      const pendingTasks = taskStats.find(s => s.status === 'TODO')?._count || 0;

      res.json({
        users: {
          total: totalUsers,
          admins: adminUsers,
          clients: clientUsers,
        },
        projects: {
          total: totalProjects,
        },
        tasks: {
          total: totalTasks,
          completed: completedTasks,
          pending: pendingTasks,
        },
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ error: 'Failed to fetch statistics' });
    }
  },
};
