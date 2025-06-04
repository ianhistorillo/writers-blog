import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import PostForm from '../components/blog/PostForm';
import { Post } from '../types';

const CreatePost: React.FC = () => {
  const { addPost } = useBlog();
  const navigate = useNavigate();
  
  const handleSubmit = (postData: Omit<Post, 'id'>) => {
    try {
      const newPost = addPost(postData);
      navigate(`/posts/${newPost.id}`);
    } catch (error) {
      console.error('Error creating post:', error);
      // Handle error appropriately
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
      <PostForm onSubmit={handleSubmit} />
    </div>
  );
};

export default CreatePost;