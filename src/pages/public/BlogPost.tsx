import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useBlog } from '../../context/BlogContext';
import Badge from '../../components/ui/Badge';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { posts } = useBlog();

  const post = posts.find(p => p.slug === slug && p.status === 'published');

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
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

  const getDefaultImage = () => {
    return 'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1';
  };

  const getCoverImage = () => {
    return post.cover_image || getDefaultImage();
  };

  const getAuthorAvatar = () => {
    return post.author.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back to Blog Link */}
      <Link 
        to="/blog" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Blog
      </Link>

      <article>
        {/* Cover Image */}
        <div className="relative mb-8">
          <img 
            src={getCoverImage()} 
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg"
            onError={(e) => {
              console.error('Image load error, using default image');
              e.currentTarget.src = getDefaultImage();
            }}
          />
          {!post.cover_image && (
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
              Default Image
            </div>
          )}
        </div>

        {/* Post Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
            <div className="flex items-center">
              <img 
                src={getAuthorAvatar()}
                alt={post.author.name}
                className="w-10 h-10 rounded-full mr-3 object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150';
                }}
              />
              <div>
                <Link 
                  to={`/author/${post.author.id}`}
                  className="font-medium text-gray-900 hover:text-blue-600"
                >
                  {post.author.name}
                </Link>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDistanceToNow(new Date(post.published_at || ''), { addSuffix: true })}
                </div>
              </div>
            </div>
          </div>

          {/* Categories and Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.categories.map(category => (
              <Badge key={category.id} variant="primary" size="sm">
                {category.name}
              </Badge>
            ))}
            {post.tags.map(tag => (
              <Badge key={tag.id} variant="secondary" size="sm">
                {tag.name}
              </Badge>
            ))}
          </div>

          {/* Excerpt */}
          <p className="text-xl text-gray-600 leading-relaxed mb-8 font-light">
            {post.excerpt}
          </p>
        </header>

        {/* Post Content */}
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Author Bio Section */}
        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <div className="flex items-start">
            <img 
              src={getAuthorAvatar()}
              alt={post.author.name}
              className="w-16 h-16 rounded-full mr-4 object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150';
              }}
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                About {post.author.name}
              </h3>
              <p className="text-gray-600 mb-3">
                A passionate writer sharing insights and stories with the community.
              </p>
              <Link 
                to={`/author/${post.author.id}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View all posts by {post.author.name} →
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;