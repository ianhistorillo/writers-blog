import React from "react";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from "./context/AuthContext";
import { BlogProvider } from "./context/BlogContext";

// Layouts
import AdminLayout from "./components/layout/AdminLayout";
import PublicLayout from "./components/layout/PublicLayout";

// Admin Pages
import Dashboard from "./pages/Dashboard";
import PostsPage from "./pages/PostsPage";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import PostDetail from "./pages/PostDetail";
import CategoriesPage from "./pages/CategoriesPage";
import CommentsPage from "./pages/CommentsPage";
import MediaPage from "./pages/MediaPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import UsersPage from "./pages/UsersPage";
import SettingsPage from "./pages/SettingsPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Public Pages
import Home from "./pages/public/Home";
import BlogList from "./pages/public/BlogList";
import BlogPost from "./pages/public/BlogPost";
import AuthorProfile from "./pages/public/AuthorProfile";
import About from "./pages/public/About";

// Route guard component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BlogProvider>
          <HashRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path="blog" element={<BlogList />} />
                <Route path="blog/test-post" element={<h1>Static test blog post</h1>} />
                <Route path="blog/:slug" element={<BlogPost />} />
                <Route path="author/:id" element={<AuthorProfile />} />
                <Route path="about" element={<About />} />
              </Route>

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="posts" element={<PostsPage />} />
                <Route path="posts/new" element={<CreatePost />} />
                <Route path="posts/:id" element={<PostDetail />} />
                <Route path="posts/:id/edit" element={<EditPost />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="comments" element={<CommentsPage />} />
                <Route path="media" element={<MediaPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/admin\" replace />} />
              </Route>
            </Routes>
          </HashRouter>
        </BlogProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;