import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import PostForm from '../components/blog/PostForm';

const CreatePost: React.FC = () => {
  const { addPost } = useBlog();
  const navigate = useNavigate();
  
  const handleSubmit = async (postData: any) => {
    try {
      const newPost = await addPost(postData);
      if (newPost) {
        navigate(`/admin/posts/${newPost.id}`);
      }
    } catch (error) {
      console.log(error);
      console.error('Error creating post:', error);
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