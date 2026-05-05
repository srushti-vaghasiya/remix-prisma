import React from 'react';
import { Link, useFetcher } from 'react-router';
import { User, LogOut, Menu, X, CheckSquare } from 'lucide-react';
import { Button } from './ui/Button';

interface NavbarProps {
  user?: {
    id: string;
    email: string;
    name?: string | null;
  } | null;
}

export const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const fetcher = useFetcher();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const isLoggingOut = fetcher.state !== 'idle';

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    fetcher.submit({}, { method: 'post', action: '/logout' });
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
      ? 'glass shadow-elevated border-b border-white/20'
      : 'bg-white/80 backdrop-blur-sm border-b border-white/10'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 group animate-fade-in"
          >
            <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-2xl font-bold text-gradient">AuthApp</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user && (
              <Link
                to="/todos"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:scale-105"
              >
                <CheckSquare size={18} />
                <span className="font-medium">Todos</span>
              </Link>
            )}

            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 glass px-4 py-2 rounded-xl">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-linear-to-br from-blue-500 to-indigo-500 border-2 border-white/50 shadow-md">
                    {(user as any).profileImage ? (
                      <img
                        src={(user as any).profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User size={18} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-gray-900">
                      {user.name || user.email}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  loading={isLoggingOut}
                  icon={<LogOut size={16} />}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="gradient" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-3 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-200"
            >
              {isMobileMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20 animate-slide-in">
            {user && (
              <Link
                to="/todos"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 py-2"
              >
                <CheckSquare size={18} />
                <span className="font-medium">Todos</span>
              </Link>
            )}

            {user ? (
              <div className="space-y-4 mt-4">
                <div className="flex items-center space-x-3 p-4 glass rounded-xl">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-linear-to-br from-blue-500 to-indigo-500 border-2 border-white/50 shadow-md">
                    {(user as any).profileImage ? (
                      <img
                        src={(user as any).profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User size={24} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {user.name || user.email}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  loading={isLoggingOut}
                  icon={<LogOut size={16} />}
                  className="w-full"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="space-y-3 mt-4">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="gradient" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
