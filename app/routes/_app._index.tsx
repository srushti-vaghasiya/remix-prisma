import { useLoaderData, Link } from 'react-router';
import { User, Shield, Calendar, CheckSquare } from 'lucide-react';
import { requireUser } from '~/utils/auth.server';
import { Button } from '~/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '~/components/ui/Card';
import type { LoaderFunctionArgs } from 'react-router';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  return { user };
}

export default function Dashboard() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-16 text-center animate-fade-in">
          <h1 className="text-5xl font-bold text-gradient mb-6">
            Welcome back, {user.name || 'User'}! 👋
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your personal workspace awaits. Manage tasks, track progress, and stay organized with our modern todo management system.
          </p>
        </div>

        {/* User Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card variant="glass" className="animate-scale-in">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-linear-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Profile</CardTitle>
                  <CardDescription>Your account</CardDescription>
                </div>
              </div>
            </CardHeader>
            <div className="space-y-4">
              {/* Profile Image */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-linear-to-br from-blue-500 to-indigo-500 border-3 border-white/50 shadow-lg">
                  {(user as any).profileImage ? (
                    <img
                      src={(user as any).profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Profile Picture</p>
                  <p className="text-xs text-gray-500">
                    {(user as any).profileImage ? 'Custom image set' : 'Default avatar'}
                  </p>
                </div>
              </div>

              {/* User Info */}
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Name</p>
                  <p className="text-sm text-gray-600">{user.name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>

              {/* Edit Profile Button */}
              <div className="pt-2">
                <Link to="/profile">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<User size={16} />}
                  >
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          <Card variant="glass" className="animate-scale-in">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                  <CheckSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Todo Management</CardTitle>
                  <CardDescription>Organize tasks</CardDescription>
                </div>
              </div>
            </CardHeader>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse-slow"></div>
                <span>Create and manage tasks</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse-slow" style={{ animationDelay: '0.5s' }}></div>
                <span>Set priorities and due dates</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                <span>Track progress and completion</span>
              </div>
            </div>
            <div className="pt-2">
              <Link to="/todos">
                <Button variant="gradient" size="sm" icon={<CheckSquare size={16} />}>
                  Manage Tasks
                </Button>
              </Link>
            </div>
          </Card>

          <Card variant="glass" className="animate-scale-in">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-linear-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Security</CardTitle>
                  <CardDescription>Protected</CardDescription>
                </div>
              </div>
            </CardHeader>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Secure password hashing</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Session-based auth</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Protected routes</span>
              </div>
            </div>
          </Card>

          <Card variant="glass" className="animate-scale-in">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-linear-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Account Age</CardTitle>
                  <CardDescription>Member since</CardDescription>
                </div>
              </div>
            </CardHeader>
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-900">Member Since</p>
              <p className="text-sm text-gray-600">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </Card>
        </div>

        {/* Features Section */}
        <Card variant="gradient" className="animate-scale-in">
          <CardHeader className="text-center">
            <CardTitle gradient className="text-3xl">Platform Features</CardTitle>
            <CardDescription className="text-lg">
              Everything you need for modern task management
            </CardDescription>
          </CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gradient">Security Features</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-slow"></div>
                  <span>Password hashing with bcrypt</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-slow" style={{ animationDelay: '0.3s' }}></div>
                  <span>HTTP-only secure session cookies</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-slow" style={{ animationDelay: '0.6s' }}></div>
                  <span>Server-side form validation</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-slow" style={{ animationDelay: '0.9s' }}></div>
                  <span>Protected routes with middleware</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gradient">User Experience</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse-slow"></div>
                  <span>Responsive modern UI design</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse-slow" style={{ animationDelay: '0.3s' }}></div>
                  <span>Real-time form validation</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse-slow" style={{ animationDelay: '0.6s' }}></div>
                  <span>Loading states and error handling</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse-slow" style={{ animationDelay: '0.9s' }}></div>
                  <span>Mobile-friendly navigation</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
