import React from 'react';
import { redirect, useLoaderData } from 'react-router';
import { Edit, Save } from 'lucide-react';
import { getTaskById, updateTask } from '~/utils/tasks.server';
import { validateForm, taskSchema } from '~/utils/validator';
import { TaskForm } from '~/components/TaskForm';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import toast from 'react-hot-toast';
import { userContext } from "~/context";

export async function loader({ request, params, context }: LoaderFunctionArgs) {
  const user = context.get(userContext)
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

export async function action({ request, params, context }: ActionFunctionArgs) {
  const user = context.get(userContext)
  const taskId = params.taskId;

  if (!taskId) {
    throw new Response('Task ID is required', { status: 400 });
  }

  const formData = await request.formData();

  const data = {
    title: formData.get('title') as string,
    description: formData.get('description') as string || '',
    priority: formData.get('priority') as string,
    completed: formData.get('completed') === 'true',
  };

  try {
    // Validate form data
    const validation = await validateForm(taskSchema, {
      ...data,
    });

    if (!validation.success) {
      return { errors: validation.errors, values: data };
    }

    // Update task
    await updateTask(taskId, user.id, {
      title: validation.data.title,
      description: validation.data.description,
      priority: validation.data.priority as any,
      completed: validation.data.completed,
    });

    return redirect(`/todos/${taskId}?message=Task updated successfully`);
  } catch (error) {
    return {
      errors: {
        _form: error instanceof Error ? error.message : 'Failed to update task',
      },
      values: data,
    };
  }
}

export default function EditTaskPage() {
  const { task } = useLoaderData<typeof loader>();

  // Show success message when redirected back
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    if (message) {
      toast.success(message);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  return (
    <TaskForm
      mode="edit"
      initialValues={{
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        completed: task.completed,
      }}
      action={`/todos/${task.id}/edit`}
      title="Edit Task"
      description="Update your task details"
      icon={<Edit className="w-8 h-8 text-white" />}
      backUrl={`/todos/${task.id}`}
      submitText="Save Changes"
      loadingText="Saving..."
    />
  );
}
