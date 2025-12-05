import { prisma } from '../../lib/prisma.js';
import { UserRole } from '@prisma/client';
import type { CreateProjectDto, UpdateProjectDto } from './projects.schemas.js';

export class ProjectsRepository {
  async findAll(userId: string, userRole: UserRole) {
    const where = userRole === UserRole.ADMIN ? {} : { ownerId: userId };

    return prisma.project.findMany({
      where,
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
  }

  async findById(id: string, userId: string, userRole: UserRole) {
    const project = await prisma.project.findUnique({
      where: { id },
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
    });

    if (!project) return null;

    // Verificar permisos
    if (userRole !== UserRole.ADMIN && project.ownerId !== userId) {
      throw new Error('Forbidden');
    }

    return project;
  }

  async create(data: CreateProjectDto, ownerId: string) {
    return prisma.project.create({
      data: {
        ...data,
        ownerId,
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateProjectDto, userId: string, userRole: UserRole) {
    // Verificar permisos primero
    const project = await this.findById(id, userId, userRole);
    if (!project) {
      throw new Error('Project not found');
    }

    return prisma.project.update({
      where: { id },
      data,
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async delete(id: string, userId: string, userRole: UserRole) {
    // Verificar permisos primero
    const project = await this.findById(id, userId, userRole);
    if (!project) {
      throw new Error('Project not found');
    }

    await prisma.project.delete({
      where: { id },
    });
  }
}
