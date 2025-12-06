import { prisma } from '../../lib/prisma.js';
import { UserRole } from '@prisma/client';
import type { CreateTagDto } from './tags.schemas.js';

export class TagsRepository {
  async findAll(userId: string, userRole: UserRole, projectId?: string) {
    const where: any = {};

    // Filtro por proyecto si se especifica
    if (projectId) {
      where.projectId = projectId;
    }

    // Si no es ADMIN, solo tags de proyectos propios
    if (userRole !== UserRole.ADMIN) {
      where.project = { ownerId: userId };
    }

    return prisma.tag.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            ownerId: true,
          },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string, userId: string, userRole: UserRole) {
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            ownerId: true,
          },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

    if (!tag) return null;

    // Verificar permisos
    if (userRole !== UserRole.ADMIN && tag.project.ownerId !== userId) {
      throw new Error('Forbidden');
    }

    return tag;
  }

  async create(data: CreateTagDto, userId: string, userRole: UserRole) {
    // Verificar que el proyecto existe y el usuario tiene acceso
    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
      select: { id: true, ownerId: true },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    if (userRole !== UserRole.ADMIN && project.ownerId !== userId) {
      throw new Error('Forbidden');
    }

    return prisma.tag.create({
      data,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            ownerId: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateTagDto, userId: string, userRole: UserRole) {
    // Verificar permisos primero
    const tag = await this.findById(id, userId, userRole);
    if (!tag) {
      throw new Error('Tag not found');
    }

    return prisma.tag.update({
      where: { id },
      data,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            ownerId: true,
          },
        },
      },
    });
  }

  async delete(id: string, userId: string, userRole: UserRole) {
    // Verificar permisos primero
    const tag = await this.findById(id, userId, userRole);
    if (!tag) {
      throw new Error('Tag not found');
    }

    await prisma.tag.delete({
      where: { id },
    });
  }
}
