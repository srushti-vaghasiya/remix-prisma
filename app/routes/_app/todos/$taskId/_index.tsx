import React from 'react';
import { useLoaderData, Link } from 'react-router';
import { ArrowLeft, Edit, Trash2, Calendar, AlertTriangle, CheckCircle, Circle } from 'lucide-react';
import { requireUser } from '~/utils/auth.server';
import { getTaskById } from '~/utils/tasks.server';
import { Button } from '~/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '~/components/ui/Card';
import type { LoaderFunctionArgs } from 'react-router';
import { ConfirmDialog } from '~/components/ui/ConfirmDialog';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  const taskId = params.taskId;

  if (!taskId) {
    throw new Response('Task ID is required', { status: 400 });
  }

  const task = await getTaskById(taskId, user.id);

  if (!task) {
    throw new Response('Task not found', { status: 404 });
  }

  return { task };
}

const priorityColors = {
  LOW: 'bg-gray-100 text-gray-700 border-gray-300',
  MEDIUM: 'bg-blue-100 text-blue-700 border-blue-300',
  HIGH: 'bg-orange-100 text-orange-700 border-orange-300',
  URGENT: 'bg-red-100 text-red-700 border-red-300',
};

const priorityIcons = {
  LOW: Calendar,
  MEDIUM: Calendar,
  HIGH: AlertTriangle,
  URGENT: AlertTriangle,
};

export default function TaskDetailPage() {
  const { task } = useLoaderData<typeof loader>();
  const PriorityIcon = priorityIcons[task.priority];
  const [deleteDialog, setDeleteDialog] = React.useState<{
    isOpen: boolean;
    taskId: string | null;
    taskTitle: string;
  }>({
    isOpen: false,
    taskId: null,
    taskTitle: '',
  });
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


  const handleDeleteClick = (taskId: string, taskTitle: string) => {
    setDeleteDialog({
      isOpen: true,
      taskId,
      taskTitle,
    });
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/todos">
            <Button
              variant="outline"
              icon={<ArrowLeft size={16} />}
            >
              Back to Tasks
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Header */}
            <Card>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
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
                        <CheckCircle className="w-8 h-8 text-green-600 hover:text-green-700" />
                      ) : (
                        <Circle className="w-8 h-8 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>

                    {/* Task Title and Priority */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h1 className={`text-2xl font-bold ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                          }`}>
                          {task.title}
                        </h1>

                        {/* Priority Badge */}
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${priorityColors[task.priority]}`}>
                          <PriorityIcon className="w-4 h-4 mr-1" />
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {task.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                    <div className={`prose max-w-none ${task.completed ? 'text-gray-400' : 'text-gray-700'
                      }`}>
                      <p className="whitespace-pre-wrap">{task.description}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center space-x-3 mt-6 pt-6 border-t border-gray-200">
                  <Link to={`/todos/${task.id}/edit`}>
                    <Button icon={<Edit size={16} />}>
                      Edit Task
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
            </Card>

            {/* Activity Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
              </CardHeader>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Task created</p>
                      <p className="text-xs text-gray-500">
                        {new Date(task.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {task.updatedAt.getTime() !== task.createdAt.getTime() && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Task updated</p>
                        <p className="text-xs text-gray-500">
                          {new Date(task.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {task.completed && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Task completed</p>
                        <p className="text-xs text-gray-500">
                          {new Date(task.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Task Details */}
            <Card>
              <CardHeader>
                <CardTitle>Task Details</CardTitle>
              </CardHeader>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Task ID</p>
                  <p className="text-sm text-gray-900 font-mono">{task.id}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <div className="flex items-center mt-1">
                    {task.completed ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        <span className="text-sm text-green-600">Completed</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">Pending</span>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Priority</p>
                  <div className="flex items-center mt-1">
                    <PriorityIcon className="w-4 h-4 mr-2" />
                    <span className="text-sm text-gray-900">{task.priority}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Created</p>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Last Updated</p>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(task.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <div className="p-6 space-y-3">
                <form method="post" action={`/todos/${task.id}/toggle`}>
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    icon={task.completed ? <Circle size={16} /> : <CheckCircle size={16} />}
                  >
                    {task.completed ? 'Mark as Pending' : 'Mark as Completed'}
                  </Button>
                </form>

                <Link to={`/todos/${task.id}/edit`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    icon={<Edit size={16} />}
                  >
                    Edit Task
                  </Button>
                </Link>

                <Link to="/todos">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Back to List
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
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
    </div>
  );
}
