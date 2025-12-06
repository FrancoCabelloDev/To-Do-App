import { TagsRepository } from './tags.repo.js';
import type { CreateTagDto, UpdateTagDto } from './tags.schemas.js';
import type { UserRole } from '@prisma/client';

export class TagsService {
  private repo = new TagsRepository();

  async getAllTags(userId: string, userRole: UserRole, projectId?: string) {
    return this.repo.findAll(userId, userRole, projectId);
  }

  async createTag(data: CreateTagDto, userId: string, userRole: UserRole) {
    return this.repo.create(data, userId, userRole);
  }

  async updateTag(id: string, data: UpdateTagDto, userId: string, userRole: UserRole) {
    return this.repo.update(id, data, userId, userRole);
  }

  async deleteTag(id: string, userId: string, userRole: UserRole) {
    await this.repo.delete(id, userId, userRole);
  }
}
