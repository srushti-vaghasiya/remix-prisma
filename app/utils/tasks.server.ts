import { prisma } from './db.server';

type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface TaskFilters {
  search?: string;
  priority?: Priority;
  completed?: boolean;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: 'createdAt' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedTasks {
  tasks: Array<{
    id: string;
    title: string;
    description: string | null;
    completed: boolean;
    priority: Priority;
    createdAt: Date;
    updatedAt: Date;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export async function getTasksForUser(
  userId: string,
  filters: TaskFilters = {},
  pagination: PaginationOptions = { page: 1, limit: 1 }
): Promise<PaginatedTasks> {
  const { page, limit, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = { userId };

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.priority) {
    where.priority = filters.priority;
  }

  if (filters.completed !== undefined) {
    where.completed = filters.completed;
  }


  // Get total count
  const total = await prisma.task.count({ where });

  // Get tasks
  const tasks = await prisma.task.findMany({
    where,
    orderBy: { [sortBy]: sortOrder },
    skip,
    take: limit,
    select: {
      id: true,
      title: true,
      description: true,
      completed: true,
      priority: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const totalPages = Math.ceil(total / limit);

  return {
    tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

export async function getTaskById(taskId: string, userId: string) {
  return prisma.task.findFirst({
    where: { id: taskId, userId },
    select: {
      id: true,
      title: true,
      description: true,
      completed: true,
      priority: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function createTask(
  userId: string,
  data: {
    title: string;
    description?: string;
    priority?: Priority;
  }
) {
  return prisma.task.create({
    data: {
      ...data,
      userId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      completed: true,
      priority: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function updateTask(
  taskId: string,
  userId: string,
  data: {
    title?: string;
    description?: string;
    completed?: boolean;
    priority?: Priority;
  }
) {
  return prisma.task.updateMany({
    where: { id: taskId, userId },
    data,
  });
}

export async function deleteTask(taskId: string, userId: string) {
  return prisma.task.deleteMany({
    where: { id: taskId, userId },
  });
}

export async function getTaskStats(userId: string) {
  const [
    total,
    completed,
    dueToday,
    upcoming,
  ] = await Promise.all([
    prisma.task.count({ where: { userId } }),
    prisma.task.count({ where: { userId, completed: true } }),

    prisma.task.count({
      where: {
        userId,
      },
    }),
    prisma.task.count({
      where: {
        userId,
        completed: false,
      },
    }),
  ]);

  return {
    total,
    completed,
    pending: total - completed,
    dueToday,
    upcoming,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}
