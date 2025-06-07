import React, { useState } from 'react';
import { MessageSquare, Check, X, Trash2, User, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useBlog } from '../context/BlogContext';
import Button from '../components/ui/Button';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const CommentsPage: React.FC = () => {
  const { comments, posts, approveComment, deleteComment } = useBlog();
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');

  const filteredComments = comments.filter(comment => {
    if (filter === 'approved') return comment.approved;
    if (filter === 'pending') return !comment.approved;
    return true;
  });

  const getPostTitle = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    return post?.title || 'Unknown Post';
  };

  const handleApprove = async (commentId: string) => {
    try {
      await approveComment(commentId);
    } catch (error) {
      console.error('Error approving comment:', error);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(commentId);
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Comments</h1>
        <div className="flex space-x-2">
          <Button
            variant={filter === 'all' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({comments.length})
          </Button>
          <Button
            variant={filter === 'approved' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter('approved')}
          >
            Approved ({comments.filter(c => c.approved).length})
          </Button>
          <Button
            variant={filter === 'pending' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter('pending')}
          >
            Pending ({comments.filter(c => !c.approved).length})
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium">
            {filter === 'all' ? 'All Comments' : 
             filter === 'approved' ? 'Approved Comments' : 'Pending Comments'}
          </h2>
        </CardHeader>
        <CardContent>
          {filteredComments.length > 0 ? (
            <div className="space-y-4">
              {filteredComments.map((comment) => (
                <div
                  key={comment.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Anonymous User</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                          </div>
                        </div>
                        <Badge 
                          variant={comment.approved ? 'success' : 'warning'}
                          size="sm"
                        >
                          {comment.approved ? 'Approved' : 'Pending'}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{comment.content}</p>
                      
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Post:</span> {getPostTitle(comment.post_id || '')}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      {!comment.approved && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleApprove(comment.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(comment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                {filter === 'all' ? 'No comments yet' :
                 filter === 'approved' ? 'No approved comments' : 'No pending comments'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CommentsPage;