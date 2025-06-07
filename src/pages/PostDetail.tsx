import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Edit, Trash2, ArrowLeft, Clock, User, Calendar, Tag, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useBlog } from '../context/BlogContext';
import Button from '../components/ui/Button';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getPostById, deletePost, getCommentsByPostId } = useBlog();
  const navigate = useNavigate();
  
  const post = getPostById(id || '');
  const comments = getCommentsByPostId(id || '');
  
  if (!post) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500 mb-4">Post not found</p>
        <button 
          onClick={() => navigate('/admin/posts')}
          className="text-blue-700 hover:text-blue-900"
        >
          Back to Posts
        </button>
      </div>
    );
  }
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deletePost(post.id);
      navigate('/admin/posts');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/posts')}
          className="text-gray-600"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Posts
        </Button>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/admin/posts/${post.id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge 
                  variant={post.status === 'published' ? 'success' : 'warning'} 
                >
                  {post.status === 'published' ? 'Published' : 'Draft'}
                </Badge>
                {post.featured && (
                  <Badge variant="primary">Featured</Badge>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {post.cover_image && (
            <div className="mb-6">
              <img 
                src={post.cover_image} 
                alt={post.title} 
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}
          
          <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6 gap-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                {post.status === 'published' 
                  ? `Published ${formatDistanceToNow(new Date(post.published_at || ''), { addSuffix: true })}` 
                  : `Last updated ${formatDistanceToNow(new Date(post.updated_at), { addSuffix: true })}`}
              </span>
            </div>
            {post.categories.length > 0 && (
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                <span>{post.categories.map(c => c.name).join(', ')}</span>
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <p className="text-lg font-medium text-gray-800 mb-2">Excerpt:</p>
            <p className="text-gray-600 italic">{post.excerpt}</p>
          </div>
          
          <div className="prose max-w-none">
            <p className="text-lg font-medium text-gray-800 mb-2">Content:</p>
            <p className="whitespace-pre-line">{post.content}</p>
          </div>
          
          {post.tags.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-800 mb-2">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <Badge key={tag.id} variant="secondary" size="sm">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Comments ({comments.length})
          </h2>
        </CardHeader>
        <CardContent>
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map(comment => (
                <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        U
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium text-gray-900">Anonymous User</h3>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="mt-1 text-gray-600">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No comments yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PostDetail;