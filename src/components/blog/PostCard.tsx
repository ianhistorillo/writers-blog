import React from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2, Star, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Post } from "../../types";
import Card, { CardContent } from "../ui/Card";
import Badge from "../ui/Badge";

interface PostCardProps {
  post: Post;
  onDelete: (id: string) => void;
  onToggleFeatured: (post: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onDelete,
  onToggleFeatured,
}) => {
  const {
    id,
    title,
    excerpt,
    cover_image,
    status,
    featured,
    published_at,
    updated_at,
  } = post;

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this post?")) {
      onDelete(id);
    }
  };

  const handleToggleFeatured = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFeatured(post);
  };

  const getDefaultImage = () => {
    return "https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1";
  };

  const getCoverImage = () => {
    return cover_image || getDefaultImage();
  };

  return (
    <Card className="h-full transition-all duration-200 hover:shadow-md">
      <Link to={`/admin/posts/${id}`} className="block h-full">
        <div className="relative h-48 overflow-hidden">
          <img
            src={getCoverImage()}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              console.error("Image load error, using default image");
              e.currentTarget.src = getDefaultImage();
            }}
          />
          <div className="absolute top-2 right-2 flex space-x-1">
            <Badge
              variant={status === "published" ? "success" : "warning"}
              size="sm"
            >
              {status === "published" ? "Published" : "Draft"}
            </Badge>
            {featured && (
              <Badge variant="primary" size="sm">
                Featured
              </Badge>
            )}
          </div>
          {!cover_image && (
            <div className="absolute bottom-2 left-2">
              <Badge variant="secondary" size="sm">
                No Image
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="flex flex-col h-full">
          <div className="flex items-center text-xs text-gray-500 mb-3">
            <Calendar className="h-3 w-3 mr-1" />
            <span>
              {status === "published"
                ? `Published ${formatDistanceToNow(
                    new Date(published_at || ""),
                    { addSuffix: true }
                  )}`
                : `Updated ${formatDistanceToNow(new Date(updated_at), {
                    addSuffix: true,
                  })}`}
            </span>
          </div>

          <h3 className="text-lg font-semibold mb-2 text-gray-900">{title}</h3>
          <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
            {excerpt}
          </p>

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
            <div className="flex space-x-2">
              {post.categories.map((category) => (
                <Badge key={category.id} variant="secondary" size="sm">
                  {category.name}
                </Badge>
              ))}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleToggleFeatured}
                className={`p-1 rounded-full ${
                  featured ? "text-amber-500" : "text-gray-400"
                } hover:bg-gray-100 transition-colors`}
                aria-label={
                  featured ? "Remove from featured" : "Add to featured"
                }
                title={featured ? "Remove from featured" : "Add to featured"}
              >
                <Star
                  className="h-4 w-4"
                  fill={featured ? "currentColor" : "none"}
                />
              </button>
              <Link
                to={`/admin/posts/${id}/edit`}
                className="p-1 rounded-full text-gray-400 hover:text-blue-500 hover:bg-gray-100 transition-colors"
                aria-label="Edit post"
                title="Edit post"
                onClick={(e) => e.stopPropagation()}
              >
                <Edit className="h-4 w-4" />
              </Link>
              <button
                onClick={handleDelete}
                className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100 transition-colors"
                aria-label="Delete post"
                title="Delete post"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default PostCard;
