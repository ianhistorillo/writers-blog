import React from "react";
import { useBlog } from "../../context/BlogContext";
import PostCard from "../../components/blog/PostCard";

const BlogList = () => {
  const { posts } = useBlog();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Blog Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default BlogList;
