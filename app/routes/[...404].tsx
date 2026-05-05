import { Link } from 'react-router';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { Button } from '~/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '~/components/ui/Card';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">404</CardTitle>
          <CardDescription className="text-lg">
            Page not found
          </CardDescription>
        </CardHeader>

        <div className="p-6 space-y-4">
          <p className="text-gray-600">
            Sorry, we couldn't find the page you're looking for.
            The page might have been removed, renamed, or is temporarily unavailable.
          </p>

          <div className="space-y-3">
            <Link to="/" className="block">
              <Button className="w-full" icon={<Home size={16} />}>
                Go to Homepage
              </Button>
            </Link>

            <Link to="/todos" className="block">
              <Button variant="outline" className="w-full">
                View Todo List
              </Button>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="w-full"
            >
              <Button variant="outline" className="w-full" icon={<ArrowLeft size={16} />}>
                Go Back
              </Button>
            </button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              If you think this is an error, please contact support.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
