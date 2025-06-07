import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Search } from 'lucide-react';
import { useBlog } from '../context/BlogContext';
import Button from '../components/ui/Button';
import PostCard from '../components/blog/PostCard';

const PostsPage: React.FC = () => {
  const { posts, categories, tags, updatePost, deletePost } = useBlog();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const handleNewPost = () => {
    navigate('/admin/posts/new');
  };
  
  const handleToggleFeatured = async (post: any) => {
    await updatePost({
      ...post,
      featured: !post.featured
    });
  };
  
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || post.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || 
                          post.categories.some(cat => cat.id === selectedCategory);
    const matchesTag = selectedTag === 'all' || 
                     post.tags.some(tag => tag.id === selectedTag);
    
    return matchesSearch && matchesStatus && matchesCategory && matchesTag;
  });
  
  const sortedPosts = [...filteredPosts].sort((a, b) => 
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
        <Button
          onClick={handleNewPost}
          variant="primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
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
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status-filter"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category-filter"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
                <label htmlFor="tag-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Tag
                </label>
                <select
                  id="tag-filter"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
        
        <div className="p-4">
          {sortedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedPosts.map(post => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onDelete={deletePost}
                  onToggleFeatured={handleToggleFeatured}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500 mb-4">No posts found</p>
              <Button
                onClick={handleNewPost}
                variant="primary"
              >
                Create your first post
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostsPage;