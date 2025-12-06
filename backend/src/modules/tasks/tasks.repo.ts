import { prisma } from '../../lib/prisma.js';
import { UserRole, TaskStatus } from '@prisma/client';
import type { CreateTaskDto, UpdateTaskDto } from './tasks.schemas.js';

export class TasksRepository {
  async findAll(userId: string, userRole: UserRole, projectId?: string) {
    const where: any = {};

    // Filtro por proyecto si se especifica
    if (projectId) {
      where.projectId = projectId;
    }

    // Si no es ADMIN, solo tareas de proyectos propios
    if (userRole !== UserRole.ADMIN) {
      where.project = { ownerId: userId };
    }

    return prisma.task.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            ownerId: true,
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
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findById(id: string, userId: string, userRole: UserRole) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            ownerId: true,
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
    });

    if (!task) return null;

    // Verificar permisos
    if (userRole !== UserRole.ADMIN && task.project.ownerId !== userId) {
      throw new Error('Forbidden');
    }

    return task;
  }

  async create(data: CreateTaskDto, createdById: string, userId: string, userRole: UserRole) {
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

    const { tagIds, ...taskData } = data;

    // Crear la tarea
    const task = await prisma.task.create({
      data: {
        ...taskData,
        createdById,
        dueAt: data.dueAt ? new Date(data.dueAt) : null,
        // Marcar como completada si el status es DONE
        completedAt: data.status === TaskStatus.DONE ? new Date() : null,
        tags: tagIds
          ? {
              create: tagIds.map((tagId) => ({
                tagId,
              })),
            }
          : undefined,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            ownerId: true,
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
    });

    return task;
  }

  async update(id: string, data: UpdateTaskDto, userId: string, userRole: UserRole) {
    // Verificar permisos primero
    const task = await this.findById(id, userId, userRole);
    if (!task) {
      throw new Error('Task not found');
    }

    const { tagIds, ...updateData } = data;

    // Validar que los tags existan y pertenezcan al proyecto de la tarea
    if (tagIds && tagIds.length > 0) {
      const validTags = await prisma.tag.findMany({
        where: {
          id: { in: tagIds },
          projectId: task.projectId,
        },
        select: { id: true },
      });

      if (validTags.length !== tagIds.length) {
        throw new Error('One or more tags are invalid or do not belong to this project');
      }
    }

    // Si cambia el status a DONE, marcar completedAt
    const completedAt =
      data.status === TaskStatus.DONE && task.status !== TaskStatus.DONE
        ? new Date()
        : data.status && data.status !== TaskStatus.DONE
        ? null
        : undefined;

    return prisma.task.update({
      where: { id },
      data: {
        ...updateData,
        dueAt: data.dueAt !== undefined ? (data.dueAt ? new Date(data.dueAt) : null) : undefined,
        completedAt,
        tags: tagIds !== undefined
          ? {
              deleteMany: {},
              create: tagIds.map((tagId) => ({
                tagId,
              })),
            }
          : undefined,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            ownerId: true,
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
    });
  }

  async delete(id: string, userId: string, userRole: UserRole) {
    // Verificar permisos primero
    const task = await this.findById(id, userId, userRole);
    if (!task) {
      throw new Error('Task not found');
    }

    await prisma.task.delete({
      where: { id },
    });
  }
}
