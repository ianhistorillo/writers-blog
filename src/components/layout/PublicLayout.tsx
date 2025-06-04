import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";

const PublicLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-serif font-bold text-gray-900">
                  Writers' Haven
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex sm:items-center sm:space-x-8">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link to="/blog" className="text-gray-600 hover:text-gray-900">
                Blog
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
              <Link
                to="/admin"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Dashboard
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-500 hover:text-gray-600"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/blog"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                to="/about"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/admin"
                className="block px-4 py-2 text-blue-600 hover:bg-blue-50 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-serif font-semibold text-gray-900 mb-4">
                Writers' Haven
              </h3>
              <p className="text-gray-600">
                A community of passionate writers sharing their stories and
                insights.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/blog"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Latest Posts
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Write for Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Connect
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-500">
              &copy; {new Date().getFullYear()} Writers' Haven. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
