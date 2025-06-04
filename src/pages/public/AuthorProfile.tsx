import React from "react";
import { useParams } from "react-router-dom";
import { User, Post } from "../../types";
import { useBlog } from "../../context/BlogContext";
import Card, { CardContent } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { Calendar, Mail, FileText } from "lucide-react";

const AuthorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { posts } = useBlog();

  // In a real app, we would fetch the author data from an API
  const author: User = {
    id: id || "1",
    name: "John Doe",
    email: "john@example.com",
    role: "author",
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
  };

  const authorPosts = posts.filter(
    (post) => post.author.id === author.id && post.status === "published"
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="shrink-0">
              {author.avatar ? (
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-2xl font-semibold text-blue-800">
                    {author.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {author.name}
              </h1>

              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>{author.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>{authorPosts.length} Published Posts</span>
                </div>
              </div>

              <Badge variant="primary">{author.role}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Published Posts
        </h2>

        {authorPosts.length > 0 ? (
          <div className="space-y-6">
            {authorPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  {post.coverImage && (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 mb-4">{post.excerpt}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(post.publishedAt || "").toLocaleDateString()}
                      </span>
                    </div>

                    {post.categories.map((category) => (
                      <Badge key={category.id} variant="secondary" size="sm">
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No published posts yet
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthorProfile;
