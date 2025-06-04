import React from "react";
import { useParams } from "react-router-dom";

const BlogPost = () => {
  const { slug } = useParams();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article className="prose lg:prose-xl">
        <h1 className="text-4xl font-bold mb-6">Blog Post</h1>
        <div className="text-gray-600 mb-8">
          {/* Placeholder content - will be replaced with actual blog post data */}
          <p>Loading blog post with slug: {slug}</p>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
