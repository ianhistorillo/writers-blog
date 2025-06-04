import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Post, Category, Tag, Comment, Stats } from '../types';
import { posts as initialPosts, categories as initialCategories, tags as initialTags, comments as initialComments, stats as initialStats } from '../data/mockData';

interface BlogContextType {
  posts: Post[];
  categories: Category[];
  tags: Tag[];
  comments: Comment[];
  stats: Stats;
  addPost: (post: Omit<Post, 'id'>) => Post;
  updatePost: (post: Post) => Post;
  deletePost: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => Category;
  addTag: (tag: Omit<Tag, 'id'>) => Tag;
  getPostById: (id: string) => Post | undefined;
  getPostsByCategory: (categoryId: string) => Post[];
  getPostsByTag: (tagId: string) => Post[];
  getPostsByStatus: (status: 'draft' | 'published') => Post[];
  getCommentsByPostId: (postId: string) => Comment[];
  approveComment: (id: string) => void;
  deleteComment: (id: string) => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [stats, setStats] = useState<Stats>(initialStats);

  const addPost = (postData: Omit<Post, 'id'>): Post => {
    const newPost: Post = {
      ...postData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: postData.status === 'published' ? new Date().toISOString() : undefined,
    };
    setPosts(prevPosts => [...prevPosts, newPost]);
    updateStats();
    return newPost;
  };

  const updatePost = (updatedPost: Post): Post => {
    setPosts(posts.map(post => post.id === updatedPost.id ? updatedPost : post));
    updateStats();
    return updatedPost;
  };

  const deletePost = (id: string): void => {
    setPosts(posts.filter(post => post.id !== id));
    setComments(comments.filter(comment => comment.postId !== id));
    updateStats();
  };

  const addCategory = (categoryData: Omit<Category, 'id'>): Category => {
    const newCategory: Category = {
      ...categoryData,
      id: crypto.randomUUID(),
    };
    setCategories([...categories, newCategory]);
    return newCategory;
  };

  const addTag = (tagData: Omit<Tag, 'id'>): Tag => {
    const newTag: Tag = {
      ...tagData,
      id: crypto.randomUUID(),
    };
    setTags([...tags, newTag]);
    return newTag;
  };

  const getPostById = (id: string): Post | undefined => {
    return posts.find(post => post.id === id);
  };

  const getPostsByCategory = (categoryId: string): Post[] => {
    return posts.filter(post => 
      post.categories.some(category => category.id === categoryId)
    );
  };

  const getPostsByTag = (tagId: string): Post[] => {
    return posts.filter(post => 
      post.tags.some(tag => tag.id === tagId)
    );
  };

  const getPostsByStatus = (status: 'draft' | 'published'): Post[] => {
    return posts.filter(post => post.status === status);
  };

  const getCommentsByPostId = (postId: string): Comment[] => {
    return comments.filter(comment => comment.postId === postId);
  };

  const approveComment = (id: string): void => {
    setComments(comments.map(comment => 
      comment.id === id ? { ...comment, approved: true } : comment
    ));
  };

  const deleteComment = (id: string): void => {
    setComments(comments.filter(comment => comment.id !== id));
    updateStats();
  };

  const updateStats = () => {
    setStats({
      totalPosts: posts.length,
      totalDrafts: posts.filter(post => post.status === 'draft').length,
      totalPublished: posts.filter(post => post.status === 'published').length,
      totalViews: 1250,
      totalComments: comments.length,
    });
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