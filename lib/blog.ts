import fs from 'fs';
import path from 'path';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
  author: string;
  tags: string[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
  published: boolean;
  featured: boolean;
  id: number;
}

// Path to the blog posts JSON file
const postsDirectory = path.join(process.cwd(), 'content');
const postsFilePath = path.join(postsDirectory, 'posts.json');

// Get all posts from JSON file
export function getAllPosts(): BlogPost[] {
  try {
    const fileContents = fs.readFileSync(postsFilePath, 'utf8');
    const posts: BlogPost[] = JSON.parse(fileContents);
    return posts;
  } catch (error) {
    console.error('Error reading posts:', error);
    return [];
  }
}

// Get all published posts sorted by date (newest first)
export function getSortedPostsData(): BlogPost[] {
  const allPosts = getAllPosts();
  const publishedPosts = allPosts.filter(post => post.published);
  
  return publishedPosts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

// Get a single post by slug
export function getPostData(slug: string): BlogPost | undefined {
  const allPosts = getAllPosts();
  return allPosts.find(post => post.slug === slug && post.published);
}

// Get all post slugs for static generation
export function getAllPostSlugs(): string[] {
  const allPosts = getAllPosts();
  return allPosts
    .filter(post => post.published)
    .map(post => post.slug);
}

// Get featured posts
export function getFeaturedPosts(): BlogPost[] {
  const allPosts = getAllPosts();
  return allPosts
    .filter(post => post.published && post.featured)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Get latest N posts
export function getLatestPosts(count: number = 3): BlogPost[] {
  const sortedPosts = getSortedPostsData();
  return sortedPosts.slice(0, count);
}

// Get posts by category
export function getPostsByCategory(category: string): BlogPost[] {
  const allPosts = getAllPosts();
  return allPosts
    .filter(post => post.published && post.category === category)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Format date to Romanian format
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ro-RO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

