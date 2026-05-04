import { redirect } from 'react-router';
import { logout } from '~/utils/auth.server';
import type { ActionFunctionArgs } from 'react-router';

export async function action({ request }: ActionFunctionArgs) {
  return await logout(request);
}
