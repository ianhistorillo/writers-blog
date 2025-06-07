import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Post, Category, Tag } from '../../types';
import { useBlog } from '../../context/BlogContext';
import { useAuth } from '../../context/AuthContext';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card, { CardContent, CardFooter } from '../ui/Card';
import MediaSelector from '../ui/MediaSelector';
import RichTextEditor from '../ui/RichTextEditor';

interface PostFormProps {
  post?: Post;
  onSubmit: (postData: any) => void;
}

const PostForm: React.FC<PostFormProps> = ({ post, onSubmit }) => {
  const navigate = useNavigate();
  const { categories, tags } = useBlog();
  const { user, profile } = useAuth();
  
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [content, setContent] = useState(post?.content || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [coverImage, setCoverImage] = useState(post?.cover_image || '');
  const [status, setStatus] = useState<'draft' | 'published'>(post?.status || 'draft');
  const [featured, setFeatured] = useState(post?.featured || false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    post?.categories.map(c => c.id) || []
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    post?.tags.map(t => t.id) || []
  );
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate slug from title
  useEffect(() => {
    if (!post && title && !slug) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      setSlug(generatedSlug);
    }
  }, [title, slug, post]);

  const validate = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!title) newErrors.title = 'Title is required';
    if (!slug) newErrors.slug = 'Slug is required';
    if (!content) newErrors.content = 'Content is required';
    if (!excerpt) newErrors.excerpt = 'Excerpt is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    const selectedCategoriesObjects = categories.filter(cat => 
      selectedCategories.includes(cat.id)
    );
    
    const selectedTagsObjects = tags.filter(tag => 
      selectedTags.includes(tag.id)
    );
    
    const now = new Date().toISOString();
    
    const basePostData = {
      title,
      slug,
      content,
      excerpt,
      cover_image: coverImage,
      categories: selectedCategoriesObjects,
      tags: selectedTagsObjects,
      created_at: post?.created_at || now,
      updated_at: now,
      published_at: status === 'published' ? (post?.published_at || now) : null,
      status,
      featured,
      author_id: user?.id || ''
    };

    const postData = post?.id
      ? { 
          ...basePostData, 
          id: post.id,
          author: {
            id: user?.id || '',
            email: user?.email || '',
            name: profile?.name || 'Anonymous',
            avatar: profile?.avatar_url
          } 
        } // Updating
      : basePostData; // Creating
    
    try {
      await onSubmit(postData);
    } catch (error) {
      console.error('Error submitting post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Input
                label="Title"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                fullWidth
                error={errors.title}
              />
              
              <Input
                label="Slug"
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="url-friendly-title"
                fullWidth
                error={errors.slug}
                helperText="URL-friendly version of the title"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Write your post content here..."
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief summary of your post"
                  rows={3}
                  className={`px-3 py-2 bg-white border shadow-sm border-gray-300 placeholder-gray-400 
                    focus:outline-none focus:border-blue-800 focus:ring-blue-800 block w-full rounded-md sm:text-sm focus:ring-1
                    ${errors.excerpt ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                  `}
                />
                {errors.excerpt && (
                  <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>
                )}
              </div>
              
              <MediaSelector
                value={coverImage}
                onChange={setCoverImage}
                label="Cover Image"
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories([...selectedCategories, category.id]);
                        } else {
                          setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                        }
                      }}
                      className="h-4 w-4 text-blue-800 focus:ring-blue-700 border-gray-300 rounded"
                    />
                    <label htmlFor={`category-${category.id}`} className="ml-2 block text-sm text-gray-700">
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Tags</h3>
              <div className="space-y-2">
                {tags.map((tag) => (
                  <div key={tag.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`tag-${tag.id}`}
                      checked={selectedTags.includes(tag.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTags([...selectedTags, tag.id]);
                        } else {
                          setSelectedTags(selectedTags.filter(id => id !== tag.id));
                        }
                      }}
                      className="h-4 w-4 text-blue-800 focus:ring-blue-700 border-gray-300 rounded"
                    />
                    <label htmlFor={`tag-${tag.id}`} className="ml-2 block text-sm text-gray-700">
                      {tag.name}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Publishing Options</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="draft"
                      name="status"
                      value="draft"
                      checked={status === 'draft'}
                      onChange={() => setStatus('draft')}
                      className="h-4 w-4 text-blue-800 focus:ring-blue-700 border-gray-300"
                    />
                    <label htmlFor="draft" className="ml-2 block text-sm text-gray-700">
                      Draft
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="published"
                      name="status"
                      value="published"
                      checked={status === 'published'}
                      onChange={() => setStatus('published')}
                      className="h-4 w-4 text-blue-800 focus:ring-blue-700 border-gray-300"
                    />
                    <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                      Published
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 text-blue-800 focus:ring-blue-700 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                  Featured Post (displayed prominently)
                </label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              isLoading={isSubmitting}
            >
              {post ? 'Update Post' : 'Create Post'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
};

export default PostForm;