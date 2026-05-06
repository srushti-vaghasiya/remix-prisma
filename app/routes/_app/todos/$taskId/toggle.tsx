import { redirect } from 'react-router';
import { getTaskById, updateTask } from '~/utils/tasks.server';
import type { ActionFunctionArgs } from 'react-router';
import { userContext } from "~/context";

export async function action({ request, params, context }: ActionFunctionArgs) {
  const user = context.get(userContext)
  const taskId = params.taskId;

  if (!taskId) {
    throw new Response('Task ID is required', { status: 400 });
  }

  // Get current task
  const task = await getTaskById(taskId, user.id);

  if (!task) {
    throw new Response('Task not found', { status: 404 });
  }

  // Toggle completion status
  await updateTask(taskId, user.id, {
    completed: !task.completed,
  });

  return redirect(`/todos/${taskId}`);
}
