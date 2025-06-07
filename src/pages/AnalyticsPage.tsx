import React from 'react';
import { TrendingUp, Users, Eye, MessageSquare, Calendar, BarChart3 } from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import Card, { CardContent, CardHeader } from '../components/ui/Card';

const AnalyticsPage: React.FC = () => {
  const { stats, posts } = useBlog();

  const analyticsData = [
    {
      title: 'Total Views',
      value: '12,543',
      change: '+12.5%',
      trend: 'up',
      icon: <Eye className="h-6 w-6 text-blue-600" />,
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Unique Visitors',
      value: '8,921',
      change: '+8.2%',
      trend: 'up',
      icon: <Users className="h-6 w-6 text-green-600" />,
      bgColor: 'bg-green-50',
    },
    {
      title: 'Engagement Rate',
      value: '64.3%',
      change: '+5.1%',
      trend: 'up',
      icon: <TrendingUp className="h-6 w-6 text-purple-600" />,
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Comments',
      value: stats.totalComments.toString(),
      change: '+15.3%',
      trend: 'up',
      icon: <MessageSquare className="h-6 w-6 text-amber-600" />,
      bgColor: 'bg-amber-50',
    },
  ];

  const topPosts = posts
    .filter(post => post.status === 'published')
    .slice(0, 5)
    .map((post, index) => ({
      ...post,
      views: Math.floor(Math.random() * 1000) + 100,
      rank: index + 1
    }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <div className="flex space-x-2">
          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.map((item, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{item.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{item.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">{item.change}</span>
                    <span className="text-sm text-gray-500 ml-1">vs last period</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${item.bgColor}`}>
                  {item.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Posts */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Top Performing Posts
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="text-sm font-bold text-gray-500 mr-3">#{post.rank}</span>
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">{post.title}</h3>
                        <p className="text-xs text-gray-500">{post.categories.map(c => c.name).join(', ')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{post.views}</p>
                    <p className="text-xs text-gray-500">views</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium">Traffic Sources</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { source: 'Direct', percentage: 45, visitors: '4,012' },
                { source: 'Search Engines', percentage: 32, visitors: '2,854' },
                { source: 'Social Media', percentage: 15, visitors: '1,338' },
                { source: 'Referrals', percentage: 8, visitors: '714' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{item.source}</span>
                      <span className="text-sm text-gray-500">{item.visitors}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Recent Activity
          </h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: 'New post published', item: 'Getting Started with React', time: '2 hours ago' },
              { action: 'Comment approved', item: 'Design Principles Every Developer Should Know', time: '4 hours ago' },
              { action: 'Post updated', item: 'SEO Strategies for 2023', time: '1 day ago' },
              { action: 'New category created', item: 'Technology', time: '2 days ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.item}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;