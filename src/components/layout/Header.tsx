import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, profile, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      await logout();
      setIsProfileMenuOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation even if logout fails
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const displayName = profile?.name || user?.email || 'Guest';
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <header className="bg-white border-b border-gray-200 fixed left-0 right-0 top-0 z-30 h-16">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="p-2 mr-2 rounded-md lg:hidden hover:bg-gray-100"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
          
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-blue-800">BlogCMS</span>
          </Link>
        </div>

        <div className="flex items-center ml-auto gap-2">
          <div className="hidden md:flex relative rounded-md shadow-sm">
            <input 
              type="text" 
              placeholder="Search..." 
              className="py-2 pl-10 pr-4 block w-64 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm" 
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          <button className="p-2 rounded-full hover:bg-gray-100">
            <Bell className="h-5 w-5 text-gray-600" />
          </button>

          {isAuthenticated ? (
            <div className="relative ml-2" ref={profileMenuRef}>
              <button 
                onClick={toggleProfileMenu}
                className="flex items-center p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={displayName} 
                    className="h-8 w-8 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`h-8 w-8 rounded-full bg-blue-800 flex items-center justify-center text-white ${profile?.avatar_url ? 'hidden' : ''}`}>
                  {userInitial}
                </div>
              </button>
              
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                    <p className="font-medium">{displayName}</p>
                    <p className="text-gray-500 text-xs">{user?.email}</p>
                  </div>
                  <Link 
                    to="/admin/settings" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Your Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center disabled:opacity-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {isLoggingOut ? 'Signing out...' : 'Sign out'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button 
              variant="primary" 
              size="sm" 
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;