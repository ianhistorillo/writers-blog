import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Mail, FileText, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useBlog } from '../../context/BlogContext';
import Card, { CardContent } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const AuthorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { posts } = useBlog();
  
  // Find author from posts
  const authorPosts = posts.filter(post => post.author.id === id && post.status === 'published');
  const author = authorPosts.length > 0 ? authorPosts[0].author : null;

  if (!author) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Author Not Found</h1>
          <p className="text-gray-600 mb-6">The author profile you're looking for doesn't exist.</p>
          <Link 
            to="/blog" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const getAuthorAvatar = () => {
    return author.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150';
  };

  const getDefaultImage = () => {
    return 'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1';
  };

  const getCoverImage = (post: any) => {
    return post.cover_image || getDefaultImage();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back to Blog Link */}
      <Link 
        to="/blog" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Blog
      </Link>

      {/* Author Profile Header */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="shrink-0">
              <img 
                src={getAuthorAvatar()} 
                alt={author.name} 
                className="w-32 h-32 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150';
                }}
              />
            </div>
            
            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{author.name}</h1>
              
              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{author.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>{authorPosts.length} Published Posts</span>
                </div>
              </div>
              
              <div className="mb-4">
                <Badge variant="primary">Author</Badge>
              </div>

              <p className="text-gray-600 leading-relaxed">
                A passionate writer sharing insights, stories, and expertise with the community. 
                Dedicated to creating engaging content that informs and inspires readers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Author's Posts */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Published Posts ({authorPosts.length})
        </h2>
        
        {authorPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authorPosts.map(post => (
              <Link 
                key={post.id} 
                to={`/blog/${post.slug}`}
                className="group"
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={getCoverImage(post)} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        console.error('Image load error, using default image');
                        e.currentTarget.src = getDefaultImage();
                      }}
                    />
                    {!post.cover_image && (
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        Default Image
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>
                          {formatDistanceToNow(new Date(post.published_at || ''), { addSuffix: true })}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {post.categories.slice(0, 2).map(category => (
                          <Badge key={category.id} variant="secondary" size="sm">
                            {category.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No published posts yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AuthorProfile;