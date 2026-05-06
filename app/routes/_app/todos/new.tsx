import React from 'react';
import { redirect } from 'react-router';
import { Plus } from 'lucide-react';
import { createTask } from '~/utils/tasks.server';
import { validateForm, taskSchema } from '~/utils/validator';
import { TaskForm } from '~/components/TaskForm';
import type { ActionFunctionArgs } from 'react-router';
import toast from 'react-hot-toast';
import { userContext } from "~/context";

export async function action({ request, context }: ActionFunctionArgs) {
  const user = context.get(userContext)
  const formData = await request.formData();

  const data = {
    title: formData.get('title') as string,
    description: formData.get('description') as string || '',
    priority: formData.get('priority') as string,
  };

  try {
    // Validate form data
    const validation = await validateForm(taskSchema, {
      ...data,
    });

    if (!validation.success) {
      return { errors: validation.errors, values: data };
    }

    // Create task
    await createTask(user.id, {
      title: validation.data.title,
      description: validation.data.description,
      priority: validation.data.priority as any,
    });

    return redirect('/todos?message=Task created successfully');
  } catch (error) {
    return {
      errors: {
        _form: error instanceof Error ? error.message : 'Failed to create task',
      },
      values: data,
    };
  }
}

export default function NewTaskPage() {
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
      mode="create"
      action="/todos/new"
      title="Create New Task"
      description="Add a new task to your todo list"
      icon={<Plus className="w-8 h-8 text-white" />}
      backUrl="/todos"
      submitText="Create Task"
      loadingText="Creating..."
    />
  );
}
