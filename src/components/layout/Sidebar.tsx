import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, Tag, MessageSquare, LineChart, Settings, Users, Image } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { user } = useAuth();
  
  const menuItems = [
    { 
      title: 'Dashboard', 
      icon: <Home className="h-5 w-5" />, 
      path: '/' 
    },
    { 
      title: 'Posts', 
      icon: <FileText className="h-5 w-5" />, 
      path: '/posts' 
    },
    { 
      title: 'Categories', 
      icon: <Tag className="h-5 w-5" />, 
      path: '/categories' 
    },
    { 
      title: 'Comments', 
      icon: <MessageSquare className="h-5 w-5" />, 
      path: '/comments' 
    },
    { 
      title: 'Media', 
      icon: <Image className="h-5 w-5" />, 
      path: '/media' 
    },
    { 
      title: 'Analytics', 
      icon: <LineChart className="h-5 w-5" />, 
      path: '/analytics' 
    },
    { 
      title: 'Users', 
      icon: <Users className="h-5 w-5" />, 
      path: '/users' 
    },
    { 
      title: 'Settings', 
      icon: <Settings className="h-5 w-5" />, 
      path: '/settings' 
    },
  ];

  return (
    <div 
      className={`
        fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out 
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <span className="text-xl font-bold text-blue-800">BlogCMS</span>
      </div>

      <div className="mt-6 px-4 py-2">
        <div className="flex items-center space-x-3 mb-6">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full" />
          ) : (
            <div className="h-10 w-10 rounded-full bg-blue-800 flex items-center justify-center text-white">
              {user?.name.charAt(0) || 'G'}
            </div>
          )}
          <div>
            <h3 className="font-medium text-gray-900">{user?.name || 'Guest'}</h3>
            <p className="text-xs text-gray-500">{user?.role || 'Not logged in'}</p>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center px-4 py-2 text-gray-600 rounded-md transition-colors 
                ${isActive ? 'bg-blue-50 text-blue-800' : 'hover:bg-gray-50'}
              `}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500">
          <p>© 2025 BlogCMS</p>
          <p>Version 0.1.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;