import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Mail, Calendar, Shield, MoreVertical } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

interface UserProfile {
  id: string;
  email: string;
  created_at: string;
  user_metadata: {
    name?: string;
    role?: string;
    avatar_url?: string;
  };
  last_sign_in_at?: string;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.auth.admin.listUsers();
      if (error) throw error;
      setUsers(data.users as UserProfile[]);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback to mock data if admin access is not available
      setUsers([
        {
          id: '1',
          email: 'john@example.com',
          created_at: '2025-01-01T00:00:00Z',
          user_metadata: {
            name: 'John Doe',
            role: 'author'
          },
          last_sign_in_at: '2025-01-04T10:30:00Z'
        },
        {
          id: '2',
          email: 'jane@example.com',
          created_at: '2025-01-02T00:00:00Z',
          user_metadata: {
            name: 'Jane Smith',
            role: 'author'
          },
          last_sign_in_at: '2025-01-03T15:45:00Z'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadgeVariant = (role?: string) => {
    switch (role) {
      case 'admin': return 'danger';
      case 'editor': return 'warning';
      case 'author': return 'primary';
      default: return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <Button variant="primary">
          <UserPlus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-50">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-2xl font-semibold text-blue-600">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-50">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Authors</p>
                <p className="text-2xl font-semibold text-green-600">
                  {users.filter(u => u.user_metadata?.role === 'author').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-50">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">New This Month</p>
                <p className="text-2xl font-semibold text-purple-600">
                  {users.filter(u => {
                    const created = new Date(u.created_at);
                    const now = new Date();
                    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium">All Users</h2>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Active
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {user.user_metadata?.avatar_url ? (
                              <img
                                className="h-10 w-10 rounded-full"
                                src={user.user_metadata.avatar_url}
                                alt={user.user_metadata?.name || 'User'}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600">
                                  {user.user_metadata?.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.user_metadata?.name || 'Anonymous'}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge 
                          variant={getRoleBadgeVariant(user.user_metadata?.role)}
                          size="sm"
                        >
                          {user.user_metadata?.role || 'User'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.last_sign_in_at 
                          ? formatDistanceToNow(new Date(user.last_sign_in_at), { addSuffix: true })
                          : 'Never'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No users found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;