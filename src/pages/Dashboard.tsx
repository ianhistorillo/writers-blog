import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, MessageSquare, Clock, Tag, Star } from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import PostCard from '../components/blog/PostCard';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { posts, stats, updatePost, deletePost, getPostsByStatus } = useBlog();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleNewPost = () => {
    navigate('/admin/posts/new');
  };

  // Filter posts by current user
  const userPosts = posts.filter(post => post.author_id === user.id);
  const userDrafts = userPosts.filter(post => post.status === 'draft');
  const userPublished = userPosts.filter(post => post.status === 'published');// If your post object has `comments` array
  const totalUserComments = userPosts.reduce((sum, post) => sum + (post.comments?.length || 0), 0);
  const hasNoPosts = userPosts.length === 0;

  const recentPosts = [...userPosts]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 3);

  const featuredPosts = userPosts.filter(post => post.featured);


  const handleToggleFeatured = async (post: any) => {
    await updatePost({ ...post, featured: !post.featured });
  };

  const statsCards = [
    {
      title: 'Total Posts',
      value: userPosts.length,
      icon: <FileText className="h-6 w-6 text-blue-800" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800',
    },
    {
      title: 'Published',
      value: userPublished.length,
      icon: <Clock className="h-6 w-6 text-green-600" />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Drafts',
      value: userDrafts.length,
      icon: <FileText className="h-6 w-6 text-amber-500" />,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-500',
    },
    {
      title: 'Comments',
      value: totalUserComments,
      icon: <MessageSquare className="h-6 w-6 text-purple-600" />,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Button onClick={handleNewPost} variant="primary">
          Create New Post
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>{stat.icon}</div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className={`text-2xl font-semibold ${stat.textColor}`}>{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {hasNoPosts && (
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
          You have no posts yet. Please create a new post.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Recent Posts</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/posts')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentPosts.length > 0 ? (
              <div className="space-y-4">
                {recentPosts.map(post => (
                  <div
                    key={post.id}
                    className="border-b border-gray-200 pb-4 last:border-0 last:pb-0"
                  >
                    <div
                      onClick={() => navigate(`/admin/posts/${post.id}`)}
                      className="block hover:bg-gray-50 -mx-4 px-4 py-2 rounded-md transition-colors cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-base font-medium text-gray-900">{post.title}</h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.excerpt}</p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Updated {new Date(post.updated_at).toLocaleDateString()}</span>
                            <span className="mx-2">•</span>
                            <Tag className="h-3 w-3 mr-1" />
                            <span>{post.categories.map(c => c.name).join(', ')}</span>
                          </div>
                        </div>
                        <div
                          className={`text-xs px-2 py-1 rounded-full ${
                            post.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {post.status === 'published' ? 'Published' : 'Draft'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No recent posts available.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <Star className="h-4 w-4 text-amber-500 mr-1" />
                Featured Posts
              </h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {featuredPosts.length > 0 ? (
                featuredPosts.map(post => (
                  <div
                    key={post.id}
                    className="border border-gray-200 rounded-md p-3 hover:bg-gray-50 transition-colors"
                    onClick={() => navigate(`/admin/posts/${post.id}`)}
                  >
                    <h3 className="text-sm font-medium text-gray-900">{post.title}</h3>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <span>Views: {Math.floor(Math.random() * 1000)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No featured posts yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">Draft Posts</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userDrafts.length > 0 ? (
              userDrafts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onDelete={deletePost}
                  onToggleFeatured={handleToggleFeatured}
                />
              ))
            ) : (
              <div className="col-span-3 py-10 text-center">
                <p className="text-gray-500">No draft posts</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
