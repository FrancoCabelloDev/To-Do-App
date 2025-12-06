export type UserRole = 'ADMIN' | 'CLIENT';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELED';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Profile {
  id: string;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  archivedAt: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner?: {
    id: string;
    email: string | null;
    fullName: string | null;
    avatarUrl: string | null;
  };
  _count?: {
    tasks: number;
    tags: number;
  };
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueAt: string | null;
  completedAt: string | null;
  createdById: string;
  assignedToId: string | null;
  createdAt: string;
  updatedAt: string;
  project: {
    id: string;
    name: string;
    ownerId: string;
  };
  createdBy: {
    id: string;
    email: string | null;
    fullName: string | null;
    avatarUrl: string | null;
  };
  assignedTo?: {
    id: string;
    email: string | null;
    fullName: string | null;
    avatarUrl: string | null;
  } | null;
  tags?: Array<{
    tag: Tag;
  }>;
}

export interface Tag {
  id: string;
  projectId: string;
  name: string;
  color: string | null;
  createdAt: string;
  project?: {
    id: string;
    name: string;
    ownerId: string;
  };
  _count?: {
    tasks: number;
  };
}

export interface CreateProjectDto {
  name: string;
  description?: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string | null;
  archivedAt?: string | null;
}

export interface CreateTaskDto {
  projectId: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueAt?: string;
  assignedToId?: string | null;
  tagIds?: string[];
}

export interface UpdateTaskDto {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueAt?: string | null;
  assignedToId?: string | null;
  tagIds?: string[];
  displayOrder?: number;
}

export interface CreateTagDto {
  projectId: string;
  name: string;
  color?: string;
}
