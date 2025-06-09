import React, { useState } from 'react';
import { Save, Globe, Mail, Shield, Bell, Palette, Upload, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import MediaSelector from '../components/ui/MediaSelector';

const SettingsPage: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  
  const [settings, setSettings] = useState({
    siteName: 'Writers\' Haven',
    siteDescription: 'A community of passionate writers sharing their stories and insights.',
    siteUrl: 'https://writershaven.com',
    adminEmail: 'admin@writershaven.com',
    allowRegistration: true,
    requireEmailVerification: false,
    moderateComments: true,
    emailNotifications: true,
    theme: 'light',
    postsPerPage: 10,
  });

  const [profileData, setProfileData] = useState({
    name: profile?.name || '',
    avatar_url: profile?.avatar_url || '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    alert('Settings saved successfully!');
  };

  const handleProfileUpdate = async () => {
    setIsUpdatingProfile(true);
    try {
      await updateProfile(profileData);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleInputChange = (key: string, value: string | boolean | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleProfileChange = (key: string, value: string) => {
    setProfileData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <Button onClick={handleSave} variant="primary" isLoading={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium flex items-center">
            <User className="h-5 w-5 mr-2" />
            Profile Settings
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input
                label="Display Name"
                value={profileData.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                fullWidth
                placeholder="Your display name"
              />
              
              <div className="flex justify-start">
                <Button 
                  onClick={handleProfileUpdate} 
                  variant="secondary" 
                  isLoading={isUpdatingProfile}
                >
                  Update Profile
                </Button>
              </div>
            </div>
            
            <div>
              <MediaSelector
                value={profileData.avatar_url}
                onChange={(url) => handleProfileChange('avatar_url', url)}
                label="Profile Picture"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              General Settings
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Site Name"
              value={settings.siteName}
              onChange={(e) => handleInputChange('siteName', e.target.value)}
              fullWidth
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Description
              </label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                rows={3}
                className="px-3 py-2 bg-white border shadow-sm border-gray-300 placeholder-gray-400 
                  focus:outline-none focus:border-blue-800 focus:ring-blue-800 block w-full rounded-md sm:text-sm focus:ring-1"
              />
            </div>
            <Input
              label="Site URL"
              value={settings.siteUrl}
              onChange={(e) => handleInputChange('siteUrl', e.target.value)}
              fullWidth
            />
            <Input
              label="Posts Per Page"
              type="number"
              value={settings.postsPerPage}
              onChange={(e) => handleInputChange('postsPerPage', parseInt(e.target.value))}
              fullWidth
            />
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Email Settings
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Admin Email"
              type="email"
              value={settings.adminEmail}
              onChange={(e) => handleInputChange('adminEmail', e.target.value)}
              fullWidth
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailNotifications"
                checked={settings.emailNotifications}
                onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                className="h-4 w-4 text-blue-800 focus:ring-blue-700 border-gray-300 rounded"
              />
              <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                Enable email notifications
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireEmailVerification"
                checked={settings.requireEmailVerification}
                onChange={(e) => handleInputChange('requireEmailVerification', e.target.checked)}
                className="h-4 w-4 text-blue-800 focus:ring-blue-700 border-gray-300 rounded"
              />
              <label htmlFor="requireEmailVerification" className="ml-2 block text-sm text-gray-700">
                Require email verification for new users
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security Settings
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowRegistration"
                checked={settings.allowRegistration}
                onChange={(e) => handleInputChange('allowRegistration', e.target.checked)}
                className="h-4 w-4 text-blue-800 focus:ring-blue-700 border-gray-300 rounded"
              />
              <label htmlFor="allowRegistration" className="ml-2 block text-sm text-gray-700">
                Allow user registration
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="moderateComments"
                checked={settings.moderateComments}
                onChange={(e) => handleInputChange('moderateComments', e.target.checked)}
                className="h-4 w-4 text-blue-800 focus:ring-blue-700 border-gray-300 rounded"
              />
              <label htmlFor="moderateComments" className="ml-2 block text-sm text-gray-700">
                Moderate comments before publishing
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              Appearance
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Theme
              </label>
              <select
                value={settings.theme}
                onChange={(e) => handleInputChange('theme', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notification Preferences
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Email Notifications</h3>
              {[
                { id: 'newComments', label: 'New comments on posts' },
                { id: 'newPosts', label: 'New posts published' },
                { id: 'userRegistration', label: 'New user registrations' },
              ].map((item) => (
                <div key={item.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={item.id}
                    defaultChecked
                    className="h-4 w-4 text-blue-800 focus:ring-blue-700 border-gray-300 rounded"
                  />
                  <label htmlFor={item.id} className="ml-2 block text-sm text-gray-700">
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Dashboard Notifications</h3>
              {[
                { id: 'systemUpdates', label: 'System updates' },
                { id: 'securityAlerts', label: 'Security alerts' },
                { id: 'maintenanceMode', label: 'Maintenance notifications' },
              ].map((item) => (
                <div key={item.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={item.id}
                    defaultChecked
                    className="h-4 w-4 text-blue-800 focus:ring-blue-700 border-gray-300 rounded"
                  />
                  <label htmlFor={item.id} className="ml-2 block text-sm text-gray-700">
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;