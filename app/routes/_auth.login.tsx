import React from 'react';
import { Form, Link, useActionData, redirect, useNavigation } from 'react-router';
import toast from 'react-hot-toast';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { login, getUser } from '~/utils/auth.server';
import { validateForm, loginSchema } from '~/utils/validator';
import { Input } from '~/components/ui/Input';
import { Button } from '~/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '~/components/ui/Card';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);
  if (user) {
    return redirect('/');
  }
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const validation = await validateForm(loginSchema, data);
  if (!validation.success) {
    return { errors: validation.errors, values: data };
  }

  try {
    return await login({
      email: validation.data.email,
      password: validation.data.password,
      request,
    });
  } catch (error) {
    return {
      errors: {
        _form: error instanceof Error ? error.message : 'Login failed',
      },
      values: data,
    };
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const errors = actionData?.errors;
  const values = actionData?.values;
  const isSubmitting = navigation.state === 'submitting';

  // Show success message if redirected from signup
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    if (message) {
      toast.success(message);
      // Clean up the URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Show error toast when there's a form error
  React.useEffect(() => {
    if (errors?._form) {
      toast.error(errors._form);
    }
  }, [errors]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>

          <Form method="post" className="space-y-6">
            {errors?._form && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <p className="text-sm text-red-700">{errors._form}</p>
              </div>
            )}

            <Input
              name="email"
              type="email"
              label="Email address"
              placeholder="Enter your email"
              icon={<Mail size={20} />}
              defaultValue={values?.email as string}
              error={errors?.email}
              required
              autoComplete="email"
            />

            <Input
              name="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              icon={<Lock size={20} />}
              error={errors?.password}
              required
              autoComplete="current-password"
            />

            <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
