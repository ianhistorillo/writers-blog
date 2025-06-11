import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Search, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useBlog } from '../../context/BlogContext';
import Card, { CardContent } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import SEOHead from '../../components/SEO/SEOHead';

const BlogList: React.FC = () => {
  const { posts, categories, tags } = useBlog();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter only published posts
  const publishedPosts = posts.filter(post => post.status === 'published');

  const filteredPosts = publishedPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                          post.categories.some(cat => cat.id === selectedCategory);
    const matchesTag = selectedTag === 'all' || 
                     post.tags.some(tag => tag.id === selectedTag);
    
    return matchesSearch && matchesCategory && matchesTag;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => 
    new Date(b.published_at || '').getTime() - new Date(a.published_at || '').getTime()
  );

  const getDefaultImage = () => {
    return 'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1';
  };

  const getCoverImage = (post: any) => {
    return post.cover_image || getDefaultImage();
  };

  const getAuthorAvatar = (post: any) => {
    return post.author.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <SEOHead 
        title="Blog Posts - Writers' Haven"
        description="Discover stories, insights, and ideas from our community of writers. Browse through our collection of published articles and find your next great read."
        image="https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&dpr=1"
        url={`${window.location.origin}/blog`}
        type="website"
      />

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Posts</h1>
        <p className="text-xl text-gray-600">
          Discover stories, insights, and ideas from our community of writers
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search posts..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                className="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tag
              </label>
              <select
                className="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
              >
                <option value="all">All Tags</option>
                {tags.map(tag => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Posts Grid */}
      {sortedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedPosts.map(post => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="group">
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
                  {post.featured && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="warning" size="sm">
                        Featured
                      </Badge>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center mb-4">
                    <img 
                      src={getAuthorAvatar(post)}
                      alt={post.author.name}
                      className="w-8 h-8 rounded-full mr-3 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150';
                      }}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDistanceToNow(new Date(post.published_at || ''), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {post.categories.slice(0, 2).map(category => (
                      <Badge key={category.id} variant="primary" size="sm">
                        {category.name}
                      </Badge>
                    ))}
                    {post.tags.slice(0, 2).map(tag => (
                      <Badge key={tag.id} variant="secondary" size="sm">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No posts found</p>
          <p className="text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default BlogList;