import React from 'react';
import { useLoaderData, Link, useSearchParams } from 'react-router';
import {
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle,
  Calendar,
  AlertTriangle,
  Clock,
  Edit,
  Trash2
} from 'lucide-react';
import { getTasksForUser, getTaskStats, type TaskFilters } from '~/utils/tasks.server';
import { Button } from '~/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '~/components/ui/Card';
import { Input } from '~/components/ui/Input';
import { ConfirmDialog } from '~/components/ui/ConfirmDialog';
import type { LoaderFunctionArgs } from 'react-router';
import { userContext } from "~/context";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const user = context.get(userContext)
  const url = new URL(request.url);

  // Parse search params
  const page = parseInt(url.searchParams.get('page') || '1');
  const search = url.searchParams.get('search') || undefined;
  const priority = url.searchParams.get('priority') as any || undefined;
  const completed = url.searchParams.get('completed') === 'true' ? true :
    url.searchParams.get('completed') === 'false' ? false : undefined;
  const sortBy = url.searchParams.get('sortBy') as any || 'createdAt';
  const sortOrder = url.searchParams.get('sortOrder') as any || 'desc';

  const filters: TaskFilters = { search, priority, completed };
  const pagination = { page, limit: 10, sortBy, sortOrder };

  const [tasksData, stats] = await Promise.all([
    getTasksForUser(user.id, filters, pagination),
    getTaskStats(user.id)
  ]);

  return {
    tasks: tasksData,
    stats,
    filters,
    pagination
  };
}

const priorityColors = {
  LOW: 'bg-gray-100 text-gray-700 border-gray-300',
  MEDIUM: 'bg-blue-100 text-blue-700 border-blue-300',
  HIGH: 'bg-orange-100 text-orange-700 border-orange-300',
  URGENT: 'bg-red-100 text-red-700 border-red-300',
};

const priorityIcons = {
  LOW: Clock,
  MEDIUM: Calendar,
  HIGH: AlertTriangle,
  URGENT: AlertTriangle,
};

export default function TodosPage() {
  const { tasks, stats, filters, pagination } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteDialog, setDeleteDialog] = React.useState<{
    isOpen: boolean;
    taskId: string | null;
    taskTitle: string;
  }>({
    isOpen: false,
    taskId: null,
    taskTitle: '',
  });

  const handleFilterChange = (key: string, value: string | null) => {
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    setSearchParams(searchParams);
  };

  const handlePageChange = (page: number) => {
    searchParams.set('page', page.toString());
    setSearchParams(searchParams);
  };

  const handleDeleteClick = (taskId: string, taskTitle: string) => {
    setDeleteDialog({
      isOpen: true,
      taskId,
      taskTitle,
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.taskId) {
      const form = document.createElement('form');
      form.method = 'post';
      form.action = `/todos/${deleteDialog.taskId}/delete`;
      document.body.appendChild(form);
      form.submit();
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({
      isOpen: false,
      taskId: null,
      taskTitle: '',
    });
  };


  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Todo Management</h1>
                <p className="text-gray-600 mt-1">Manage your tasks and stay organized</p>
              </div>
              <Link to="/todos/new">
                <Button icon={<Plus size={16} />}>
                  Add Task
                </Button>
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-sm text-gray-600">Total Tasks</div>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.completionRate}%</div>
                  <div className="text-sm text-gray-600">Completion Rate</div>
                </div>
              </Card>
            </div>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <Input
                    placeholder="Search tasks..."
                    icon={<Search size={20} />}
                    value={filters.search || ''}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Priority Filter */}
                <select
                  value={filters.priority || ''}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  className="px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Priorities</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>

                {/* Status Filter */}
                <select
                  value={filters.completed === undefined ? '' : filters.completed.toString()}
                  onChange={(e) => handleFilterChange('completed', e.target.value)}
                  className="px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="false">Pending</option>
                  <option value="true">Completed</option>
                </select>

                {/* Sort */}
                <select
                  value={`${pagination.sortBy}-${pagination.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    handleFilterChange('sortBy', sortBy);
                    handleFilterChange('sortOrder', sortOrder);
                  }}
                  className="px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="priority-desc">Priority (High to Low)</option>
                  <option value="priority-asc">Priority (Low to High)</option>
                  <option value="title-asc">Title (A-Z)</option>
                  <option value="title-desc">Title (Z-A)</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Tasks List */}
          <div className="space-y-4">
            {tasks.tasks.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                  <p className="text-gray-600 mb-4">
                    {filters.search || filters.priority || filters.completed !== undefined
                      ? 'Try adjusting your filters or search terms'
                      : 'Get started by creating your first task'}
                  </p>
                  <Link to="/todos/new">
                    <Button icon={<Plus size={16} />}>
                      Create Task
                    </Button>
                  </Link>
                </div>
              </Card>
            ) : (
              tasks.tasks.map((task) => {
                const PriorityIcon = priorityIcons[task.priority];

                return (
                  <Card key={task.id} className="hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          {/* Status Icon */}
                          <button
                            className="mt-1 shrink-0"
                            onClick={() => {
                              const form = document.createElement('form');
                              form.method = 'post';
                              form.action = `/todos/${task.id}/toggle`;
                              document.body.appendChild(form);
                              form.submit();
                            }}
                          >
                            {task.completed ? (
                              <CheckCircle className="w-6 h-6 text-green-600 hover:text-green-700" />
                            ) : (
                              <Circle className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                            )}
                          </button>

                          {/* Task Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className={`text-lg font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                {task.title}
                              </h3>

                              {/* Priority Badge */}
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}>
                                <PriorityIcon className="w-3 h-3 mr-1" />
                                {task.priority}
                              </span>
                            </div>

                            {task.description && (
                              <p className={`text-sm mb-3 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                                {task.description}
                              </p>
                            )}

                            {/* Actions */}
                            <div className="flex items-center space-x-2">
                              <Link to={`/todos/${task.id}/edit`}>
                                <Button variant="outline" size="sm" icon={<Edit size={14} />}>
                                  Edit
                                </Button>
                              </Link>

                              <Button
                                variant="danger"
                                size="sm"
                                icon={<Trash2 size={14} />}
                                onClick={() => handleDeleteClick(task.id, task.title)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {tasks.pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {((tasks.pagination.page - 1) * tasks.pagination.limit) + 1} to{' '}
                {Math.min(tasks.pagination.page * tasks.pagination.limit, tasks.pagination.total)} of{' '}
                {tasks.pagination.total} tasks
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<ChevronLeft size={16} />}
                  disabled={!tasks.pagination.hasPrev}
                  onClick={() => handlePageChange(tasks.pagination.page - 1)}
                >
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: tasks.pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${page === tasks.pagination.page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  icon={<ChevronRight size={16} />}
                  disabled={!tasks.pagination.hasNext}
                  onClick={() => handlePageChange(tasks.pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteDialog.taskTitle}"? This action cannot be undone.`}
        confirmText="Delete Task"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
}
