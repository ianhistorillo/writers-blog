import { Post, User, Category, Tag, Comment, Stats } from '../types';

// Mock Users
export const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    role: 'admin'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    role: 'editor'
  }
];

// Mock Categories
export const categories: Category[] = [
  { id: '1', name: 'Technology', slug: 'technology' },
  { id: '2', name: 'Design', slug: 'design' },
  { id: '3', name: 'Marketing', slug: 'marketing' },
  { id: '4', name: 'Business', slug: 'business' }
];

// Mock Tags
export const tags: Tag[] = [
  { id: '1', name: 'React', slug: 'react' },
  { id: '2', name: 'JavaScript', slug: 'javascript' },
  { id: '3', name: 'UX', slug: 'ux' },
  { id: '4', name: 'UI', slug: 'ui' },
  { id: '5', name: 'SEO', slug: 'seo' }
];

// Mock Posts
export const posts: Post[] = [
  {
    id: '1',
    title: 'Getting Started with React',
    slug: 'getting-started-with-react',
    content: 'React is a JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies. React can be used as a base in the development of single-page or mobile applications.',
    excerpt: 'Learn the basics of React to build modern web applications.',
    coverImage: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    author: users[0],
    categories: [categories[0]],
    tags: [tags[0], tags[1]],
    createdAt: '2023-03-01T08:00:00.000Z',
    updatedAt: '2023-03-10T10:30:00.000Z',
    publishedAt: '2023-03-15T12:00:00.000Z',
    status: 'published',
    featured: true
  },
  {
    id: '2',
    title: 'Design Principles Every Developer Should Know',
    slug: 'design-principles-every-developer-should-know',
    content: 'Design principles are the fundamental ideas about the practice of good visual design that are shared by experienced designers and have been practiced over and over again. They are widely applicable across all visual design disciplines.',
    excerpt: 'Essential design concepts for creating beautiful and usable interfaces.',
    coverImage: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    author: users[1],
    categories: [categories[1]],
    tags: [tags[3], tags[4]],
    createdAt: '2023-03-05T09:15:00.000Z',
    updatedAt: '2023-03-15T11:45:00.000Z',
    publishedAt: '2023-03-20T14:30:00.000Z',
    status: 'published',
    featured: false
  },
  {
    id: '3',
    title: 'SEO Strategies for 2023',
    slug: 'seo-strategies-for-2023',
    content: 'Search engine optimization (SEO) is the process of improving the quality and quantity of website traffic to a website or a web page from search engines. SEO targets unpaid traffic (known as "natural" or "organic" results) rather than direct traffic or paid traffic.',
    excerpt: 'Up-to-date SEO techniques to improve your website visibility.',
    coverImage: 'https://images.pexels.com/photos/905163/pexels-photo-905163.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    author: users[0],
    categories: [categories[2]],
    tags: [tags[4]],
    createdAt: '2023-03-10T10:20:00.000Z',
    updatedAt: '2023-03-12T16:00:00.000Z',
    publishedAt: undefined,
    status: 'draft',
    featured: false
  },
  {
    id: '4',
    title: 'Building a Successful Business',
    slug: 'building-a-successful-business',
    content: 'Starting a business can be rewarding but also challenging. A solid business plan, market research, and securing funding are key steps to starting a successful business.',
    excerpt: 'Key strategies for entrepreneurs looking to build sustainable businesses.',
    coverImage: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    author: users[1],
    categories: [categories[3]],
    tags: [],
    createdAt: '2023-03-15T14:30:00.000Z',
    updatedAt: '2023-03-18T09:45:00.000Z',
    publishedAt: undefined,
    status: 'draft',
    featured: false
  }
];

// Mock Comments
export const comments: Comment[] = [
  {
    id: '1',
    postId: '1',
    author: 'Mike Johnson',
    email: 'mike@example.com',
    content: 'Great article! Really helped me understand React better.',
    createdAt: '2023-03-16T10:20:00.000Z',
    approved: true
  },
  {
    id: '2',
    postId: '1',
    author: 'Sarah Williams',
    email: 'sarah@example.com',
    content: 'Thanks for this. Could you explain hooks in more detail?',
    createdAt: '2023-03-17T15:45:00.000Z',
    approved: true
  },
  {
    id: '3',
    postId: '2',
    author: 'David Lee',
    email: 'david@example.com',
    content: 'I never considered how important whitespace is. Good points!',
    createdAt: '2023-03-21T09:30:00.000Z',
    approved: true
  },
  {
    id: '4',
    postId: '2',
    author: 'Anonymous',
    email: 'anon@example.com',
    content: 'This is spam content.',
    createdAt: '2023-03-22T11:15:00.000Z',
    approved: false
  }
];

// Mock Stats
export const stats: Stats = {
  totalPosts: 4,
  totalDrafts: 2,
  totalPublished: 2,
  totalViews: 1250,
  totalComments: 4
};