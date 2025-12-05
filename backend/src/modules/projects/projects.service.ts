import { ProjectsRepository } from './projects.repo.js';
import type { CreateProjectDto, UpdateProjectDto } from './projects.schemas.js';
import type { UserRole } from '@prisma/client';

export class ProjectsService {
  private repo = new ProjectsRepository();

  async getAllProjects(userId: string, userRole: UserRole) {
    return this.repo.findAll(userId, userRole);
  }

  async getProjectById(id: string, userId: string, userRole: UserRole) {
    const project = await this.repo.findById(id, userId, userRole);
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  }

  async createProject(data: CreateProjectDto, ownerId: string) {
    return this.repo.create(data, ownerId);
  }

  async updateProject(id: string, data: UpdateProjectDto, userId: string, userRole: UserRole) {
    return this.repo.update(id, data, userId, userRole);
  }

  async deleteProject(id: string, userId: string, userRole: UserRole) {
    await this.repo.delete(id, userId, userRole);
  }
}
