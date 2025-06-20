import React from "react";
import { Link } from "react-router-dom";
import { useBlog } from "../../context/BlogContext";
import { formatDistanceToNow } from "date-fns";
import SEOHead from "../../components/SEO/SEOHead";

const Home: React.FC = () => {
  const { posts } = useBlog();

  const featuredPosts = posts
    .filter((post) => post.status === "published" && post.featured)
    .slice(0, 3);

  const recentPosts = posts
    .filter((post) => post.status === "published")
    .sort(
      (a, b) =>
        new Date(b.published_at || "").getTime() -
        new Date(a.published_at || "").getTime()
    )
    .slice(0, 6);

  const getDefaultImage = () => {
    return 'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1';
  };

  const getCoverImage = (post: any) => {
    return post.cover_image || getDefaultImage();
  };

  const getAuthorAvatar = (post: any) => {
    return post.author.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150';
  };

  return (
    <div>
      <SEOHead 
        title="Writers' Haven - A Community of Passionate Writers"
        description="A community-driven platform where writers share their stories, insights, and creative works with readers around the world."
        image="https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&dpr=1"
        url={window.location.href}
        type="website"
      />

      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 opacity-90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              Welcome to Writers' Haven
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              A community of passionate writers sharing their stories, insights,
              and creative works.
            </p>
            <Link
              to="/blog"
              className="inline-block bg-white text-gray-900 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
            >
              Start Reading
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">
            Featured Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                <div className="relative h-64 mb-4 overflow-hidden rounded-lg">
                  <img
                    src={getCoverImage(post)}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      console.error('Image load error, using default image');
                      e.currentTarget.src = getDefaultImage();
                    }}
                  />
                  {!post.cover_image && (
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                      No Image
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2 group-hover:text-blue-600">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-2">{post.excerpt}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <img
                    src={getAuthorAvatar(post)}
                    alt={post.author.name}
                    className="w-6 h-6 rounded-full mr-2 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150';
                    }}
                  />
                  <span>{post.author.name}</span>
                  <span className="mx-2">•</span>
                  <span>
                    {formatDistanceToNow(new Date(post.published_at || ""), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">
            Latest Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {getCoverImage(post) && (
                  <div className="relative">
                    <img
                      src={getCoverImage(post)}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        console.error('Image load error, using default image');
                        e.currentTarget.src = getDefaultImage();
                      }}
                    />
                    {!post.cover_image && (
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <img
                      src={getAuthorAvatar(post)}
                      alt={post.author.name}
                      className="w-6 h-6 rounded-full mr-2 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150';
                      }}
                    />
                    <span>{post.author.name}</span>
                    <span className="mx-2">•</span>
                    <span>
                      {formatDistanceToNow(new Date(post.published_at || ""), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/blog"
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              View All Posts
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-gray-600 mb-8">
              Get the latest stories and updates delivered straight to your
              inbox.
            </p>
            <form className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;