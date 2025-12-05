import { TasksRepository } from './tasks.repo.js';
import type { CreateTaskDto, UpdateTaskDto } from './tasks.schemas.js';
import type { UserRole } from '@prisma/client';

export class TasksService {
  private repo = new TasksRepository();

  async getAllTasks(userId: string, userRole: UserRole, projectId?: string) {
    return this.repo.findAll(userId, userRole, projectId);
  }

  async getTaskById(id: string, userId: string, userRole: UserRole) {
    const task = await this.repo.findById(id, userId, userRole);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  }

  async createTask(data: CreateTaskDto, createdById: string, userId: string, userRole: UserRole) {
    return this.repo.create(data, createdById, userId, userRole);
  }

  async updateTask(id: string, data: UpdateTaskDto, userId: string, userRole: UserRole) {
    return this.repo.update(id, data, userId, userRole);
  }

  async deleteTask(id: string, userId: string, userRole: UserRole) {
    await this.repo.delete(id, userId, userRole);
  }
}
