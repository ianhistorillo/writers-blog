import { Database } from './supabase';

export type Tables = Database['public']['Tables'];
export type Post = Tables['posts']['Row'] & {
  author: User;
  categories: Category[];
  tags: Tag[];
};
export type Category = Tables['categories']['Row'];
export type Tag = Tables['tags']['Row'];
export type Comment = Tables['comments']['Row'];

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: string;
}

export interface Stats {
  totalPosts: number;
  totalDrafts: number;
  totalPublished: number;
  totalViews: number;
  totalComments: number;
}