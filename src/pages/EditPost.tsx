import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import PostForm from '../components/blog/PostForm';

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getPostById, updatePost } = useBlog();
  const navigate = useNavigate();
  
  const post = getPostById(id || '');
  
  if (!post) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500 mb-4">Post not found</p>
        <button 
          onClick={() => navigate('/posts')}
          className="text-blue-700 hover:text-blue-900"
        >
          Back to Posts
        </button>
      </div>
    );
  }
  
  const handleSubmit = (postData: any) => {
    updatePost(postData);
    navigate(`/posts/${post.id}`);
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Edit Post: {post.title}</h1>
      <PostForm post={post} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditPost;