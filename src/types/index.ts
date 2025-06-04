export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'author';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  author: User;
  categories: Category[];
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  status: 'draft' | 'published';
  featured: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  email: string;
  content: string;
  createdAt: string;
  approved: boolean;
}

export interface Stats {
  totalPosts: number;
  totalDrafts: number;
  totalPublished: number;
  totalViews: number;
  totalComments: number;
}