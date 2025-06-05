import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import { Post, Category, Tag, Comment, Stats, Tables } from '../types';

interface BlogContextType {
  posts: Post[];
  categories: Category[];
  tags: Tag[];
  comments: Comment[];
  stats: Stats;
  addPost: (post: Omit<Tables['posts']['Insert'], 'id' | 'author_id'>) => Promise<Post | null>;
  updatePost: (post: Post) => Promise<Post | null>;
  deletePost: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<Category | null>;
  addTag: (tag: Omit<Tag, 'id'>) => Promise<Tag | null>;
  getPostById: (id: string) => Promise<Post | null>;
  getPostsByCategory: (categoryId: string) => Post[];
  getPostsByTag: (tagId: string) => Post[];
  getPostsByStatus: (status: 'draft' | 'published') => Post[];
  getCommentsByPostId: (postId: string) => Comment[];
  approveComment: (id: string) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    totalDrafts: 0,
    totalPublished: 0,
    totalViews: 0,
    totalComments: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch posts with authors
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select(`
            *,
            author:author_id(id, email, user_metadata),
            categories:post_categories(category:categories(*)),
            tags:post_tags(tag:tags(*))
          `);

        if (postsError) throw postsError;

        // Transform the data to match our Post type
        const transformedPosts = postsData.map(post => ({
          ...post,
          author: {
            id: post.author.id,
            email: post.author.email,
            name: post.author.user_metadata?.name || 'Anonymous',
            avatar: post.author.user_metadata?.avatar_url
          },
          categories: post.categories.map((c: any) => c.category),
          tags: post.tags.map((t: any) => t.tag)
        }));

        setPosts(transformedPosts);

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*');
        
        if (categoriesError) throw categoriesError;
        setCategories(categoriesData);

        // Fetch tags
        const { data: tagsData, error: tagsError } = await supabase
          .from('tags')
          .select('*');
        
        if (tagsError) throw tagsError;
        setTags(tagsData);

        // Fetch comments
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select('*');
        
        if (commentsError) throw commentsError;
        setComments(commentsData);

        // Update stats
        setStats({
          totalPosts: postsData.length,
          totalDrafts: postsData.filter(p => p.status === 'draft').length,
          totalPublished: postsData.filter(p => p.status === 'published').length,
          totalViews: 0, // This would need a separate table to track views
          totalComments: commentsData.length,
        });

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const addPost = async (postData: Omit<Tables['posts']['Insert'], 'id' | 'author_id'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([{ ...postData, author_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      // Add categories and tags
      if (postData.categories?.length) {
        await supabase
          .from('post_categories')
          .insert(postData.categories.map(cat => ({
            post_id: data.id,
            category_id: cat.id
          })));
      }

      if (postData.tags?.length) {
        await supabase
          .from('post_tags')
          .insert(postData.tags.map(tag => ({
            post_id: data.id,
            tag_id: tag.id
          })));
      }

      // Fetch the complete post with relationships
      const { data: post } = await supabase
        .from('posts')
        .select(`
          *,
          author:author_id(id, email, user_metadata),
          categories:post_categories(category:categories(*)),
          tags:post_tags(tag:tags(*))
        `)
        .eq('id', data.id)
        .single();

      setPosts(prev => [...prev, post]);
      return post;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
      return null;
    }
  };

  const updatePost = async (post: Post) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('posts')
        .update(post)
        .eq('id', post.id)
        .select()
        .single();

      if (error) throw error;

      // Update categories
      await supabase
        .from('post_categories')
        .delete()
        .eq('post_id', post.id);

      if (post.categories.length) {
        await supabase
          .from('post_categories')
          .insert(post.categories.map(cat => ({
            post_id: post.id,
            category_id: cat.id
          })));
      }

      // Update tags
      await supabase
        .from('post_tags')
        .delete()
        .eq('post_id', post.id);

      if (post.tags.length) {
        await supabase
          .from('post_tags')
          .insert(post.tags.map(tag => ({
            post_id: post.id,
            tag_id: tag.id
          })));
      }

      setPosts(prev => prev.map(p => p.id === post.id ? { ...data, ...post } : p));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post');
      return null;
    }
  };

  const deletePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPosts(prev => prev.filter(post => post.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
    }
  };

  const addCategory = async (categoryData: Omit<Category, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([categoryData])
        .select()
        .single();

      if (error) throw error;

      setCategories(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category');
      return null;
    }
  };

  const addTag = async (tagData: Omit<Tag, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .insert([tagData])
        .select()
        .single();

      if (error) throw error;

      setTags(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tag');
      return null;
    }
  };

  const getPostById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:author_id(id, email, user_metadata),
          categories:post_categories(category:categories(*)),
          tags:post_tags(tag:tags(*))
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch post');
      return null;
    }
  };

  const getPostsByCategory = (categoryId: string) => {
    return posts.filter(post =>
      post.categories.some(category => category.id === categoryId)
    );
  };

  const getPostsByTag = (tagId: string) => {
    return posts.filter(post =>
      post.tags.some(tag => tag.id === tagId)
    );
  };

  const getPostsByStatus = (status: 'draft' | 'published') => {
    return posts.filter(post => post.status === status);
  };

  const getCommentsByPostId = (postId: string) => {
    return comments.filter(comment => comment.post_id === postId);
  };

  const approveComment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ approved: true })
        .eq('id', id);

      if (error) throw error;

      setComments(prev =>
        prev.map(comment =>
          comment.id === id ? { ...comment, approved: true } : comment
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve comment');
    }
  };

  const deleteComment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setComments(prev => prev.filter(comment => comment.id !== id));
      setStats(prev => ({
        ...prev,
        totalComments: prev.totalComments - 1
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment');
    }
  };

  return (
    <BlogContext.Provider
      value={{
        posts,
        categories,
        tags,
        comments,
        stats,
        addPost,
        updatePost,
        deletePost,
        addCategory,
        addTag,
        getPostById,
        getPostsByCategory,
        getPostsByTag,
        getPostsByStatus,
        getCommentsByPostId,
        approveComment,
        deleteComment,
        isLoading,
        error
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = (): BlogContextType => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};