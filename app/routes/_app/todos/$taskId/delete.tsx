import { redirect } from 'react-router';
import { requireUser } from '~/utils/auth.server';
import { deleteTask } from '~/utils/tasks.server';
import type { ActionFunctionArgs } from 'react-router';

export async function action({ request, params }: ActionFunctionArgs) {
  const user = await requireUser(request);
  const taskId = params.taskId;

  if (!taskId) {
    throw new Response('Task ID is required', { status: 400 });
  }

  // Delete task
  await deleteTask(taskId, user.id);

  return redirect('/todos');
}
