import { redirect } from 'react-router';
import { deleteTask } from '~/utils/tasks.server';
import type { ActionFunctionArgs } from 'react-router';
import { userContext } from "~/context";

export async function action({ request, params, context }: ActionFunctionArgs) {
  const user = context.get(userContext)
  const taskId = params.taskId;

  if (!taskId) {
    throw new Response('Task ID is required', { status: 400 });
  }

  // Delete task
  await deleteTask(taskId, user.id);

  return redirect('/todos');
}
